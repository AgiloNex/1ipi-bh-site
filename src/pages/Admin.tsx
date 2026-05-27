import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Plus,
  Shield,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useSiteContent } from "@/context/site-content-context";
import { ministryIconMap, ministryIconOptions } from "@/lib/site-content";
import type { MinistryIconName } from "@/lib/site-content";

const Admin = () => {
  const {
    ministries,
    galleryImages,
    addMinistry,
    updateMinistry,
    removeMinistry,
    moveMinistry,
    addGalleryImage,
    updateGalleryImage,
    removeGalleryImage,
    moveGalleryImage,
    toggleGalleryImage,
  } = useSiteContent();

  const [newMinistry, setNewMinistry] = useState<{
    title: string;
    description: string;
    iconName: MinistryIconName;
  }>({
    title: "",
    description: "",
    iconName: "Users",
  });
  const [newImage, setNewImage] = useState({
    src: "",
    alt: "",
    enabled: true,
  });

  const handleAddMinistry = () => {
    if (!newMinistry.title.trim() || !newMinistry.description.trim()) {
      return;
    }

    addMinistry({
      title: newMinistry.title.trim(),
      description: newMinistry.description.trim(),
      iconName: newMinistry.iconName,
    });

    setNewMinistry({
      title: "",
      description: "",
      iconName: "Users",
    });
  };

  const handleAddImage = () => {
    if (!newImage.src.trim() || !newImage.alt.trim()) {
      return;
    }

    addGalleryImage({
      src: newImage.src.trim(),
      alt: newImage.alt.trim(),
      enabled: newImage.enabled,
    });

    setNewImage({
      src: "",
      alt: "",
      enabled: true,
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 bg-gradient-to-br from-primary/10 via-background to-secondary/40">
        <div className="container-church px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2">
                <Badge className="gap-1 bg-primary text-primary-foreground">
                  <Shield className="h-3.5 w-3.5" />
                  Admin local
                </Badge>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
                Gerenciar ministérios e galeria
              </h1>
              <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
                Edite nomes, descrições, ícones e fotos direto aqui. As mudanças ficam salvas neste navegador.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao site
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-church">
          <Tabs defaultValue="ministerios" className="space-y-6">
            <TabsList className="grid w-full max-w-xl grid-cols-2">
              <TabsTrigger value="ministerios">Ministérios</TabsTrigger>
              <TabsTrigger value="galeria">Galeria</TabsTrigger>
            </TabsList>

            <TabsContent value="ministerios" className="space-y-6">
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Novo ministério</CardTitle>
                  <CardDescription>Adicione um novo bloco que já aparece na página pública.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ministry-title">Nome</Label>
                    <Input
                      id="ministry-title"
                      value={newMinistry.title}
                      onChange={(event) =>
                        setNewMinistry((current) => ({ ...current, title: event.target.value }))
                      }
                      placeholder="Ex.: Discipulado"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ministry-icon">Ícone</Label>
                    <Select
                      value={newMinistry.iconName}
                      onValueChange={(value) =>
                        setNewMinistry((current) => ({ ...current, iconName: value as MinistryIconName }))
                      }
                    >
                      <SelectTrigger id="ministry-icon">
                        <SelectValue placeholder="Escolha um ícone" />
                      </SelectTrigger>
                      <SelectContent>
                        {ministryIconOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="ministry-description">Descrição</Label>
                    <Textarea
                      id="ministry-description"
                      value={newMinistry.description}
                      onChange={(event) =>
                        setNewMinistry((current) => ({ ...current, description: event.target.value }))
                      }
                      placeholder="Descreva o ministério"
                      rows={4}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Button onClick={handleAddMinistry}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar ministério
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 xl:grid-cols-2">
                {ministries.map((ministry, index) => {
                  const Icon = ministryIconMap[ministry.iconName];

                  return (
                    <Card key={ministry.id} className="border-border/70">
                      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Ministério {index + 1}</CardTitle>
                            <CardDescription>Edite o conteúdo exibido na home.</CardDescription>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => moveMinistry(ministry.id, "up")}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => moveMinistry(ministry.id, "down")}
                            disabled={index === ministries.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => removeMinistry(ministry.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`ministry-title-${ministry.id}`}>Nome</Label>
                          <Input
                            id={`ministry-title-${ministry.id}`}
                            value={ministry.title}
                            onChange={(event) =>
                              updateMinistry(ministry.id, { title: event.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`ministry-icon-${ministry.id}`}>Ícone</Label>
                          <Select
                            value={ministry.iconName}
                            onValueChange={(value) =>
                              updateMinistry(ministry.id, {
                                iconName: value as keyof typeof ministryIconMap,
                              })
                            }
                          >
                            <SelectTrigger id={`ministry-icon-${ministry.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ministryIconOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`ministry-description-${ministry.id}`}>Descrição</Label>
                          <Textarea
                            id={`ministry-description-${ministry.id}`}
                            value={ministry.description}
                            onChange={(event) =>
                              updateMinistry(ministry.id, { description: event.target.value })
                            }
                            rows={4}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="galeria" className="space-y-6">
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Nova foto</CardTitle>
                  <CardDescription>Adicione uma URL de imagem e um texto alternativo.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="image-src">URL da imagem</Label>
                    <Input
                      id="image-src"
                      value={newImage.src}
                      onChange={(event) =>
                        setNewImage((current) => ({ ...current, src: event.target.value }))
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image-alt">Descrição</Label>
                    <Input
                      id="image-alt"
                      value={newImage.alt}
                      onChange={(event) =>
                        setNewImage((current) => ({ ...current, alt: event.target.value }))
                      }
                      placeholder="Ex.: Batismo ao ar livre"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">Mostrar na galeria</p>
                      <p className="text-xs text-muted-foreground">Se desativado, a foto não aparece ao público.</p>
                    </div>
                    <Switch
                      checked={newImage.enabled}
                      onCheckedChange={(checked) =>
                        setNewImage((current) => ({ ...current, enabled: checked }))
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Button onClick={handleAddImage}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar foto
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 xl:grid-cols-2">
                {galleryImages.map((image, index) => (
                  <Card key={image.id} className="border-border/70 overflow-hidden">
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                            <ImageIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Foto {index + 1}</CardTitle>
                            <CardDescription>Controle imagem, ordem e visibilidade.</CardDescription>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => moveGalleryImage(image.id, "up")}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => moveGalleryImage(image.id, "down")}
                            disabled={index === galleryImages.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => removeGalleryImage(image.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                        <div className="overflow-hidden rounded-lg border border-border/60 bg-muted">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`image-src-${image.id}`}>URL da imagem</Label>
                            <Input
                              id={`image-src-${image.id}`}
                              value={image.src}
                              onChange={(event) =>
                                updateGalleryImage(image.id, { src: event.target.value })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`image-alt-${image.id}`}>Descrição</Label>
                            <Input
                              id={`image-alt-${image.id}`}
                              value={image.alt}
                              onChange={(event) =>
                                updateGalleryImage(image.id, { alt: event.target.value })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3">
                            <div>
                              <p className="text-sm font-medium">Visível no site</p>
                              <p className="text-xs text-muted-foreground">
                                {image.enabled ? "Ativa" : "Oculta da galeria pública"}
                              </p>
                            </div>
                            <Switch checked={image.enabled} onCheckedChange={() => toggleGalleryImage(image.id)} />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-10" />
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>O site público usa o mesmo conteúdo salvo aqui, então qualquer ajuste aparece na home.</p>
            <p>Se quiser, depois eu posso ligar isso ao Supabase para salvar tudo no banco em vez do navegador.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Admin;
