#!/usr/bin/env node

/**
 * Concurrency test — simula race conditions no state compartilhado.
 *
 * Executa operações paralelas no site-content-context (localStorage)
 * para verificar consistência sob concorrência simulada.
 *
 * Uso:
 *   node scripts/concurrency-test.js
 */

import { randomUUID } from "crypto";

const STORAGE_KEY = "1ipi-bh-site-content";

const defaultContent = {
  ministries: [
    { id: "default-1", title: "Default 1", description: "Desc 1", iconName: "Users" },
    { id: "default-2", title: "Default 2", description: "Desc 2", iconName: "Music" },
  ],
  galleryImages: [],
};

function resetState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultContent));
}

function readState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

// Simulate addMinistry operation
function addMinistry(title) {
  const current = readState();
  current.ministries = current.ministries || [];
  current.ministries.push({
    id: randomUUID(),
    title,
    description: `Description for ${title}`,
    iconName: "Users",
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

// Simulate removeMinistry operation
function removeMinistry(id) {
  const current = readState();
  if (!current.ministries) return;
  current.ministries = current.ministries.filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

// Simulate updateMinistry operation
function updateMinistry(id, updates) {
  const current = readState();
  if (!current.ministries) return;
  current.ministries = current.ministries.map((m) =>
    m.id === id ? { ...m, ...updates } : m,
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

async function runConcurrentTest() {
  console.log("🧪 Concurrency Test: localStorage race conditions\n");

  // Test 1: Parallel adds
  console.log("Test 1: 10 parallel adds");
  resetState();
  const addPromises = Array.from({ length: 10 }, (_, i) =>
    Promise.resolve().then(() => addMinistry(`Parallel ${i}`)),
  );
  await Promise.all(addPromises);
  const state1 = readState();
  console.log(`   Ministries: ${state1.ministries.length} (expected: 12 = 2 default + 10 added)`);
  if (state1.ministries.length === 12) {
    console.log("   ✅ Parallel adds preserved all items");
  } else {
    console.log(`   ⚠️  Lost ${12 - state1.ministries.length} items due to race condition`);
  }

  // Test 2: Add + remove + update in parallel
  console.log("\nTest 2: Mixed operations (add + remove + update)");
  resetState();

  const targetId = "default-1";
  const operations = [
    addMinistry("Mixed 1"),
    addMinistry("Mixed 2"),
    removeMinistry(targetId),
    updateMinistry("default-2", { title: "Updated Default" }),
    addMinistry("Mixed 3"),
  ];

  await Promise.all(operations.map((op) => Promise.resolve().then(() => op)));
  const state2 = readState();
  const hasDefault1 = state2.ministries.some((m) => m.id === "default-1");
  const default2 = state2.ministries.find((m) => m.id === "default-2");
  console.log(`   default-1 removed: ${!hasDefault1}`);
  console.log(`   default-2 updated: ${default2?.title === "Updated Default"}`);
  console.log(`   Total ministries: ${state2.ministries.length}`);

  // Test 3: Rapid sequential operations
  console.log("\nTest 3: 100 rapid sequential adds");
  resetState();
  for (let i = 0; i < 100; i++) {
    addMinistry(`Rapid ${i}`);
  }
  const state3 = readState();
  console.log(`   Ministries: ${state3.ministries.length} (expected: 102)`);
  if (state3.ministries.length === 102) {
    console.log("   ✅ All sequential adds preserved");
  } else {
    console.log(`   ⚠️  Lost ${102 - state3.ministries.length} items`);
  }

  // Test 4: Read-modify-write race condition
  console.log("\nTest 4: Read-modify-write race (simulated)");
  resetState();

  // Simulate what happens when two parallel requests read the same base state
  const simulateRaceCondition = () => {
    const baseState = JSON.parse(JSON.stringify(defaultContent));
    
    // Both "concurrent" operations read the same initial state
    const op1State = JSON.parse(JSON.stringify(baseState));
    const op2State = JSON.parse(JSON.stringify(baseState));

    // Both add a ministry
    op1State.ministries.push({ id: "race-1", title: "Race 1", description: "Race", iconName: "Users" });
    op2State.ministries.push({ id: "race-2", title: "Race 2", description: "Race", iconName: "Users" });

    // One writes first
    localStorage.setItem(STORAGE_KEY, JSON.stringify(op1State));
    // Then the other writes — OVERWRITES the first!
    localStorage.setItem(STORAGE_KEY, JSON.stringify(op2State));
  };

  simulateRaceCondition();
  const state4 = readState();
  const hasRace1 = state4.ministries.some((m) => m.id === "race-1");
  console.log(`   Race-1 ministry exists: ${hasRace1}`);
  if (!hasRace1) {
    console.log("   ⚠️  Race condition confirmed: second write overwrote first!");
    console.log("   This is the exact pattern in site-content-context.tsx with setContent+useState");
    console.log("   React's setContent uses functional updates, which mitigates this in React.");
    console.log("   But the localStorage write in useEffect can still cause races between tabs.");
  } else {
    console.log("   ✅ Both entries preserved");
  }

  console.log("\n📊 Summary:");
  console.log("   localStorage is not safe for concurrent writes from multiple tabs.");
  console.log("   React's functional setContent (setContent(prev => ...)) mitigates");
  console.log("   intra-component race conditions, but cross-tab writes still collide.");
  console.log("   For production, migrate to Supabase realtime or use BroadcastChannel API.\n");
}

// Polyfill localStorage for Node.js
import { EventEmitter } from "events";

class LocalStorageMock {
  constructor() {
    this._store = {};
  }
  getItem(key) {
    return this._store[key] ?? null;
  }
  setItem(key, value) {
    this._store[key] = String(value);
  }
  removeItem(key) {
    delete this._store[key];
  }
  clear() {
    this._store = {};
  }
  get length() {
    return Object.keys(this._store).length;
  }
}

global.localStorage = new LocalStorageMock();

runConcurrentTest().catch(console.error);