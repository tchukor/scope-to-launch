import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { ChokurLogo } from "@/chokur/components/brand/ChokurLogo";
import { cn } from "@/lib/utils";

// ============================================================================
// shadcn/ui Component Imports (44 components)
// ============================================================================
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuLabel, ContextMenuCheckboxItem, ContextMenuRadioGroup, ContextMenuRadioItem } from "@/components/ui/context-menu";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem } from "@/components/ui/menubar";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuTrigger, NavigationMenuSeparator } from "@/components/ui/navigation-menu";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis } from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Toggle, ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle";
import { ToggleGroup as ToggleGroupComp, ToggleGroupItem as ToggleGroupItemComp } from "@/components/ui/toggle-group";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { ChartContainer } from "@/components/ui/chart";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator } from "@/components/ui/command";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, useForm } from "@/components/ui/form";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Custom Chokur Components
import { ChokurLogo as ChokurLogoComp } from "@/chokur/components/brand/ChokurLogo";
import { GradeChip } from "@/chokur/components/data-display/GradeChip";
import { Sidebar } from "@/chokur/components/layout/Sidebar";
import { TopNavBar } from "@/chokur/components/layout/TopNavBar";

const TITLE = "Component Library — Chokur Design System";
const DESC = "Complete component library showcase with all variants and states";

export const Route = createFileRoute("/ui-components")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
    ],
  }),
  component: UIComponentsRoot,
});

function UIComponentsRoot() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body-md">
      <ComponentLibraryShell />
    </div>
  );
}

function ComponentLibraryShell() {
  const [activeCategory, setActiveCategory] = React.useState<string>("all");

  const categories = [
    { key: "all", label: "All", count: COMPONENT_GROUPS.reduce((sum, g) => sum + g.components.length, 0) },
    { key: "form", label: "Form", count: COMPONENT_GROUPS.find(g => g.key === "form")?.components.length || 0 },
    { key: "data", label: "Data Display", count: COMPONENT_GROUPS.find(g => g.key === "data")?.components.length || 0 },
    { key: "navigation", label: "Navigation", count: COMPONENT_GROUPS.find(g => g.key === "navigation")?.components.length || 0 },
    { key: "feedback", label: "Feedback", count: COMPONENT_GROUPS.find(g => g.key === "feedback")?.components.length || 0 },
    { key: "overlay", label: "Overlay", count: COMPONENT_GROUPS.find(g => g.key === "overlay")?.components.length || 0 },
    { key: "layout", label: "Layout", count: COMPONENT_GROUPS.find(g => g.key === "layout")?.components.length || 0 },
    { key: "chokur", label: "Chokur Custom", count: COMPONENT_GROUPS.find(g => g.key === "chokur")?.components.length || 0 },
  ];

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="mx-auto max-w-[1400px] flex h-14 items-center justify-between px-4" aria-label="Component library navigation">
          <Link to="/" className="flex items-center gap-2 shrink-0" title="Back to Chokur App">
            <ChokurLogo variant="symbol" size={28} className="text-primary" />
            <span className="hidden sm:inline font-headline-sm text-foreground">Chokur</span>
          </Link>

          <div className="flex flex-1 items-center justify-center gap-1 overflow-x-auto px-4 pb-1 scrollbar-hide" role="tablist" aria-label="Component categories">
            {categories.map((cat) => (
              <button
                key={cat.key}
                role="tab"
                aria-selected={activeCategory === cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeCategory === cat.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <span>{cat.label}</span>
                <span className="inline-flex items-center justify-center rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-mono font-medium text-primary">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <Link
            to="/ui-showcase"
            className="shrink-0 flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span className="hidden sm:inline">Showcase</span>
          </Link>
        </nav>
      </header>

      {/* Component Grid */}
      <main className="mx-auto max-w-[1400px] flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="font-headline-lg text-foreground tracking-tight">Component Library</h1>
          <p className="mt-1 text-muted-foreground text-body-md">
            {COMPONENT_GROUPS.reduce((sum, g) => sum + g.components.length, 0)} components · shadcn/ui v4 + Radix UI + Tailwind CSS v4
          </p>
        </div>

        <div className="space-y-8">
          {COMPONENT_GROUPS
            .filter((group) => activeCategory === "all" || group.key === activeCategory)
            .map((group) => (
              <ComponentSection key={group.key} group={group} />
            ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50">
        <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 text-sm text-muted-foreground">
          <p>Chokur Design System v1.0 — {COMPONENT_GROUPS.reduce((sum, g) => sum + g.components.length, 0)} components</p>
          <div className="flex items-center gap-4">
            <Link to="/ui-showcase" className="hover:text-foreground transition-colors">Dashboard Showcase</Link>
            <Link to="https://github.com/tchukor/scope-to-launch" target="_blank" rel="noopener" className="hover:text-foreground transition-colors">
              <span className="material-symbols-outlined text-[18px] align-middle">code</span>
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

function ComponentSection({ group }: { group: ComponentGroup }) {
  return (
    <section aria-labelledby={`${group.key}-heading`} className="animate-slide-up">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-border">
        <div>
          <h2 id={`${group.key}-heading`} className="font-headline-md text-foreground">{group.label}</h2>
          <p className="text-muted-foreground text-sm mt-0.5">{group.description}</p>
        </div>
        <span className="inline-flex items-center justify-center rounded-full bg-muted px-2 py-0.5 text-xs font-mono font-medium text-muted-foreground">
          {group.components.length} components
        </span>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {group.components.map((comp) => (
          <ComponentCard key={comp.name} component={comp} />
        ))}
      </div>
    </section>
  );
}

function ComponentCard({ component }: { component: ComponentDef }) {
  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden transition-all hover:shadow-md hover:border-primary/30">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-headline-sm text-foreground truncate">{component.name}</h3>
            <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{component.description}</p>
          </div>
          {component.badge && (
            <span className="shrink-0 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {component.badge}
            </span>
          )}
        </div>
        <div className="bg-muted/50 rounded-lg p-3 min-h-[120px]">
          {component.preview}
        </div>
      </div>
      <div className="px-4 py-3 bg-muted/30 border-t border-border flex items-center justify-end gap-2">
        {component.variants && component.variants.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {component.variants.map((v) => (
              <span key={v} className="inline-flex items-center rounded-full bg-background px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground border border-border">
                {v}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Component Definitions
// ============================================================================

interface ComponentDef {
  name: string;
  description: string;
  preview: React.ReactNode;
  variants?: string[];
  badge?: string;
}

interface ComponentGroup {
  key: string;
  label: string;
  description: string;
  components: ComponentDef[];
}

const COMPONENT_GROUPS: ComponentGroup[] = [
  {
    key: "form",
    label: "Form Inputs",
    description: "Interactive form controls with validation states",
    components: [
      {
        name: "Button",
        description: "Primary actions with multiple variants and sizes",
        variants: ["default", "destructive", "outline", "secondary", "ghost", "link", "sm", "lg", "icon"],
        preview: (
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button variant="outline" size="icon"><span className="material-symbols-outlined">add</span></Button>
          </div>
        ),
      },
      {
        name: "Input",
        description: "Text input with label and error states",
        variants: ["default", "error", "disabled"],
        preview: (
          <div className="space-y-3 w-full">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email-error">Email (error)</Label>
              <Input id="email-error" aria-invalid="true" aria-describedby="email-error-msg" className="border-destructive" placeholder="invalid-email" />
              <p id="email-error-msg" className="text-xs text-destructive">Invalid email address</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email-disabled">Email (disabled)</Label>
              <Input id="email-disabled" disabled placeholder="Disabled input" />
            </div>
          </div>
        ),
      },
      {
        name: "Textarea",
        description: "Multi-line text input",
        variants: ["default", "error", "disabled"],
        preview: (
          <div className="space-y-3 w-full">
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Type your message..." rows={3} />
            </div>
          </div>
        ),
      },
      {
        name: "Label",
        description: "Form label with required indicator",
        variants: ["default", "required"],
        preview: (
          <div className="space-y-3">
            <Label htmlFor="name">Name</Label>
            <Label htmlFor="required-field" className="text-primary">Required Field <span className="text-destructive">*</span></Label>
          </div>
        ),
      },
      {
        name: "Switch",
        description: "Toggle switch for boolean values",
        variants: ["default", "checked", "disabled"],
        preview: (
          <div className="flex items-center gap-4">
            <Switch id="switch-1" />
            <Switch id="switch-2" checked />
            <Switch id="switch-3" disabled />
            <Switch id="switch-4" checked disabled />
          </div>
        ),
      },
      {
        name: "Checkbox",
        description: "Checkbox for single or multiple selection",
        variants: ["default", "checked", "indeterminate", "disabled"],
        preview: (
          <div className="flex items-center gap-4">
            <Checkbox id="check-1" />
            <Checkbox id="check-2" checked />
            <Checkbox id="check-3" indeterminate />
            <Checkbox id="check-4" disabled />
          </div>
        ),
      },
      {
        name: "Radio Group",
        description: "Single selection from multiple options",
        variants: ["horizontal", "vertical"],
        preview: (
          <RadioGroup defaultValue="option1">
            <div className="flex items-center gap-4">
              <Label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="option1" />
                Option One
              </Label>
              <Label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="option2" />
                Option Two
              </Label>
              <Label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="option3" disabled />
                Disabled
              </Label>
            </div>
          </RadioGroup>
        ),
      },
      {
        name: "Select",
        description: "Dropdown selection with search",
        variants: ["default", "multi", "disabled"],
        preview: (
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Option One</SelectItem>
              <SelectItem value="2">Option Two</SelectItem>
              <SelectItem value="3" disabled>Disabled</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
      {
        name: "Input OTP",
        description: "One-time password input fields",
        variants: ["default", "disabled"],
        preview: (
          <InputOTP maxLength={6}>
            <InputOTPGroup className="flex gap-1">
              <InputOTPSlot index={0} className="h-10 w-10 text-center text-lg" />
              <InputOTPSlot index={1} className="h-10 w-10 text-center text-lg" />
              <InputOTPSlot index={2} className="h-10 w-10 text-center text-lg" />
              <InputOTPSeparator className="flex items-center justify-center text-muted-foreground">:</InputOTPSeparator>
              <InputOTPSlot index={3} className="h-10 w-10 text-center text-lg" />
              <InputOTPSlot index={4} className="h-10 w-10 text-center text-lg" />
              <InputOTPSlot index={5} className="h-10 w-10 text-center text-lg" />
            </InputOTPGroup>
          </InputOTP>
        ),
      },
      {
        name: "Slider",
        description: "Range slider for numeric input",
        variants: ["default", "range", "disabled"],
        preview: (
          <div className="space-y-3 w-full">
            <Slider defaultValue={[33]} max={100} step={1} className="w-full" />
            <Slider defaultValue={[20, 80]} max={100} step={1} className="w-full" />
          </div>
        ),
      },
      {
        name: "Toggle / Toggle Group",
        description: "Toggle buttons for single/multiple selection",
        variants: ["single", "multiple", "outline"],
        preview: (
          <div className="space-y-3">
            <ToggleGroupComp type="single" defaultValue="bold" className="flex gap-1 bg-muted p-1 rounded-lg">
              <ToggleGroupItemComp value="bold" className="px-3 py-1.5 text-sm"><span className="material-symbols-outlined text-[16px]">format_bold</span></ToggleGroupItemComp>
              <ToggleGroupItemComp value="italic" className="px-3 py-1.5 text-sm"><span className="material-symbols-outlined text-[16px]">format_italic</span></ToggleGroupItemComp>
              <ToggleGroupItemComp value="underline" className="px-3 py-1.5 text-sm"><span className="material-symbols-outlined text-[16px]">format_underline</span></ToggleGroupItemComp>
            </ToggleGroupComp>
          </div>
        ),
      },
    ],
  },
  {
    key: "data",
    label: "Data Display",
    description: "Components for displaying structured data",
    components: [
      {
        name: "Card",
        description: "Flexible content container with header, content, footer",
        variants: ["default", "with header", "with footer"],
        preview: (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">Card content with some descriptive text about the card.</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" size="sm">Cancel</Button>
              <Button size="sm">Save</Button>
            </CardFooter>
          </Card>
        ),
      },
      {
        name: "Table",
        description: "Tabular data with sorting, selection, pagination",
        variants: ["default", "striped", "hover"],
        preview: (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">John Doe</TableCell>
                  <TableCell className="hidden md:table-cell">Admin</TableCell>
                  <TableCell className="text-right"><Badge variant="default">Active</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Jane Smith</TableCell>
                  <TableCell className="hidden md:table-cell">Teacher</TableCell>
                  <TableCell className="text-right"><Badge variant="secondary">Pending</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bob Wilson</TableCell>
                  <TableCell className="hidden md:table-cell">Student</TableCell>
                  <TableCell className="text-right"><Badge variant="destructive">Inactive</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ),
      },
      {
        name: "Badge",
        description: "Status indicators and labels",
        variants: ["default", "secondary", "destructive", "outline"],
        preview: (
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        ),
      },
      {
        name: "Avatar",
        description: "User profile images with fallbacks",
        variants: ["image", "fallback", "sizes"],
        preview: (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/icon.svg" alt="@username" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8">
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Avatar className="h-12 w-12">
              <AvatarFallback>CD</AvatarFallback>
            </Avatar>
          </div>
        ),
      },
      {
        name: "Progress",
        description: "Progress bars and indicators",
        variants: ["default", "indeterminate"],
        preview: (
          <div className="space-y-3 w-full">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>66%</span>
              </div>
              <Progress value={66} className="h-2" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Indeterminate</span>
              </div>
              <Progress className="h-2" />
            </div>
          </div>
        ),
      },
      {
        name: "Skeleton",
        description: "Loading placeholders",
        variants: ["text", "card", "circular", "rectangular"],
        preview: (
          <div className="space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
        ),
      },
      {
        name: "Chart",
        description: "Recharts wrapper for data visualization",
        variants: ["line", "bar", "pie", "area"],
        preview: (
          <ChartContainer
            config={{
              students: { label: "Students", color: "hsl(var(--primary))" },
              teachers: { label: "Teachers", color: "hsl(var(--secondary))" },
            }}
          >
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
              Chart preview (requires data)
            </div>
          </ChartContainer>
        ),
      },
      {
        name: "Calendar",
        description: "Date picker and calendar display",
        variants: ["single", "range", "multiple"],
        preview: (
          <Calendar mode="single" className="w-auto" />
        ),
      },
    ],
  },
  {
    key: "navigation",
    label: "Navigation",
    description: "Components for navigating within the application",
    components: [
      {
        name: "Tabs",
        description: "Tabbed content panes",
        variants: ["default", "underline"],
        preview: (
          <Tabs defaultValue="tab1">
            <TabsList className="w-full">
              <TabsTrigger value="tab1">Tab One</TabsTrigger>
              <TabsTrigger value="tab2">Tab Two</TabsTrigger>
              <TabsTrigger value="tab3" disabled>Disabled</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-3 p-3 bg-muted rounded-lg text-sm">Content for Tab One</TabsContent>
            <TabsContent value="tab2" className="mt-3 p-3 bg-muted rounded-lg text-sm">Content for Tab Two</TabsContent>
            <TabsContent value="tab3" className="mt-3 p-3 bg-muted rounded-lg text-sm">Content for Tab Three</TabsContent>
          </Tabs>
        ),
      },
      {
        name: "Breadcrumb",
        description: "Hierarchical navigation trail",
        variants: ["default", "with ellipsis"],
        preview: (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="/dashboard/analytics">Analytics</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Overview</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        ),
      },
      {
        name: "Pagination",
        description: "Page navigation controls",
        variants: ["default", "compact"],
        preview: (
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
              <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
              <PaginationItem><PaginationEllipsis /></PaginationItem>
              <PaginationItem><PaginationLink href="#">10</PaginationLink></PaginationItem>
              <PaginationItem><PaginationNext href="#" /></PaginationItem>
            </PaginationContent>
          </Pagination>
        ),
      },
      {
        name: "Navigation Menu",
        description: "Top-level navigation with dropdowns",
        variants: ["default", "with indicators"],
        preview: (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href="#">Feature One</NavigationMenuLink>
                  <NavigationMenuLink href="#">Feature Two</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Company</NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#">Contact</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuIndicator />
          </NavigationMenu>
        ),
      },
      {
        name: "Menubar",
        description: "Application menu bar",
        variants: ["default", "with checkboxes", "with radio groups"],
        preview: (
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>New</MenubarItem>
                <MenubarItem>Open</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Save</MenubarItem>
                <MenubarItem disabled>Save As...</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Undo</MenubarItem>
                <MenubarItem>Redo</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Cut</MenubarItem>
                <MenubarItem>Copy</MenubarItem>
                <MenubarItem>Paste</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        ),
      },
    ],
  },
  {
    key: "feedback",
    label: "Feedback",
    description: "User feedback and status indicators",
    components: [
      {
        name: "Alert",
        description: "Important messages and notifications",
        variants: ["default", "destructive"],
        preview: (
          <div className="space-y-3">
            <Alert>
              <span className="material-symbols-outlined text-[20px]">info</span>
              <div className="flex-1">
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>This is an informational alert message.</AlertDescription>
              </div>
            </Alert>
            <Alert variant="destructive">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <div className="flex-1">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Something went wrong. Please try again.</AlertDescription>
              </div>
            </Alert>
          </div>
        ),
      },
      {
        name: "Toast (Sonner)",
        description: "Toast notifications system",
        variants: ["success", "error", "warning", "info", "promise"],
        badge: "Provider",
        preview: (
          <TooltipProvider>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Use Sonner provider in app root. Demo shows variants:</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Success</Badge>
                <Badge variant="outline">Error</Badge>
                <Badge variant="outline">Warning</Badge>
                <Badge variant="outline">Info</Badge>
                <Badge variant="outline">Promise</Badge>
              </div>
            </div>
            <Sonner />
          </TooltipProvider>
        ),
      },
      {
        name: "Tooltip",
        description: "Contextual help on hover/focus",
        variants: ["default", "delayed", "side positions"],
        preview: (
          <TooltipProvider>
            <div className="flex flex-wrap gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">Tooltip on top</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Right side</Button>
                </TooltipTrigger>
                <TooltipContent side="right">Tooltip on right</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        ),
      },
      {
        name: "Hover Card",
        description: "Rich hover previews",
        variants: ["default", "with actions"],
        preview: (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="outline">Hover for preview</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 p-3">
              <p className="font-medium">Hover Card</p>
              <p className="text-sm text-muted-foreground mt-1">Rich preview content on hover</p>
            </HoverCardContent>
          </HoverCard>
        ),
      },
    ],
  },
  {
    key: "overlay",
    label: "Overlay",
    description: "Modal dialogs, sheets, and floating panels",
    components: [
      {
        name: "Dialog",
        description: "Modal dialog for focused tasks",
        variants: ["default", "with form", "alert"],
        preview: (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>This is a dialog description with more details.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost">Cancel</Button>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ),
      },
      {
        name: "Alert Dialog",
        description: "Destructive action confirmation",
        variants: ["default"],
        preview: (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" outline>Show Alert Dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ),
      },
      {
        name: "Sheet",
        description: "Side sheet for mobile and desktop",
        variants: ["left", "right", "top", "bottom"],
        preview: (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Sheet</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px]">
              <SheetHeader>
                <SheetTitle>Sheet Title</SheetTitle>
                <SheetDescription>Content from the side.</SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <Button variant="ghost" className="w-full">Close</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ),
      },
      {
        name: "Drawer",
        description: "Flexible drawer from any side",
        variants: ["left", "right", "top", "bottom"],
        preview: (
          <Drawer direction="right">
            <DrawerTrigger asChild>
              <Button variant="outline">Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent className="w-[400px]">
              <DrawerHeader>
                <DrawerTitle>Drawer Title</DrawerTitle>
                <DrawerDescription>Drawer content goes here.</DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button variant="ghost" className="w-full">Close</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ),
      },
      {
        name: "Popover",
        description: "Floating content anchored to trigger",
        variants: ["default", "with form"],
        preview: (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
              <p className="font-medium">Popover Content</p>
              <p className="text-sm text-muted-foreground mt-1">Anchored floating panel</p>
            </PopoverContent>
          </Popover>
        ),
      },
      {
        name: "Dropdown Menu",
        description: "Contextual action menus",
        variants: ["default", "checkboxes", "radio groups", "separators"],
        preview: (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
      {
        name: "Context Menu",
        description: "Right-click contextual menus",
        variants: ["default", "with submenus"],
        preview: (
          <ContextMenu>
            <ContextMenuTrigger>
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
                Right-click here
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Copy</ContextMenuItem>
              <ContextMenuItem>Paste</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem className="text-destructive">Delete</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ),
      },
    ],
  },
  {
    key: "layout",
    label: "Layout",
    description: "Structural and organizational components",
    components: [
      {
        name: "Accordion",
        description: "Collapsible content sections",
        variants: ["single", "multiple"],
        preview: (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Chokur?</AccordionTrigger>
              <AccordionContent>Chokur is a Kenyan secondary school management system for KCSE grading.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How does offline work?</AccordionTrigger>
              <AccordionContent>Data syncs when online; all features work offline via IndexedDB.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it free?</AccordionTrigger>
              <AccordionContent>Yes, Chokur is open source and free for schools.</AccordionContent>
            </AccordionItem>
          </Accordion>
        ),
      },
      {
        name: "Collapsible",
        description: "Simple show/hide content",
        variants: ["default", "controlled"],
        preview: (
          <Collapsible>
            <CollapsibleTrigger className="font-medium hover:underline cursor-pointer">Show more</CollapsibleTrigger>
            <CollapsibleContent className="mt-2 text-sm text-muted-foreground">
              This content can be collapsed and expanded.
            </CollapsibleContent>
          </Collapsible>
        ),
      },
      {
        name: "Separator",
        description: "Visual dividers",
        variants: ["horizontal", "vertical", "with text"],
        preview: (
          <div className="flex items-center gap-4">
            <div className="flex-1">Before</div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex-1">After</div>
          </div>
        ),
      },
      {
        name: "Scroll Area",
        description: "Custom styled scrollbars",
        variants: ["vertical", "horizontal", "both"],
        preview: (
          <ScrollArea className="h-40 w-full rounded-lg border border-border">
            <div className="p-4 space-y-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-8 bg-muted rounded" />
              ))}
            </div>
          </ScrollArea>
        ),
      },
      {
        name: "Resizable",
        description: "Resizable panel groups",
        variants: ["horizontal", "vertical"],
        preview: (
          <ResizablePanelGroup direction="horizontal" className="h-40 border border-border rounded-lg overflow-hidden">
            <ResizablePanel className="flex items-center justify-center bg-muted min-w-[100px]">Panel 1</ResizablePanel>
            <ResizableHandle className="bg-border" />
            <ResizablePanel className="flex items-center justify-center bg-muted min-w-[100px]">Panel 2</ResizablePanel>
            <ResizableHandle className="bg-border" />
            <ResizablePanel className="flex items-center justify-center bg-muted min-w-[100px]">Panel 3</ResizablePanel>
          </ResizablePanelGroup>
        ),
      },
      {
        name: "Aspect Ratio",
        description: "Maintain aspect ratio for content",
        variants: ["16:9", "4:3", "1:1", "21:9"],
        preview: (
          <div className="grid gap-2 sm:grid-cols-2">
            <AspectRatio ratio={16/9} className="bg-muted rounded-lg" />
            <AspectRatio ratio={4/3} className="bg-muted rounded-lg" />
            <AspectRatio ratio={1} className="bg-muted rounded-lg" />
            <AspectRatio ratio={21/9} className="bg-muted rounded-lg" />
          </div>
        ),
      },
      {
        name: "Carousel",
        description: "Swipeable content carousel",
        variants: ["default", "with indicators", "auto-play"],
        preview: (
          <Carousel className="relative h-40 rounded-lg overflow-hidden">
            <CarouselContent className="h-full">
              <CarouselItem className="bg-primary/10 flex items-center justify-center">Slide 1</CarouselItem>
              <CarouselItem className="bg-secondary/10 flex items-center justify-center">Slide 2</CarouselItem>
              <CarouselItem className="bg-accent/10 flex items-center justify-center">Slide 3</CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
          </Carousel>
        ),
      },
    ],
  },
  {
    key: "chokur",
    label: "Chokur Custom",
    description: "Domain-specific components for the Chokur system",
    components: [
      {
        name: "ChokurLogo",
        description: "Brand logo with symbol, horizontal, and vertical variants",
        variants: ["symbol", "horizontal", "vertical", "sizes: 20-48px"],
        preview: (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <ChokurLogoComp variant="symbol" size={24} />
              <ChokurLogoComp variant="symbol" size={32} />
              <ChokurLogoComp variant="symbol" size={48} />
            </div>
            <div className="flex items-center gap-4">
              <ChokurLogoComp variant="horizontal" size={24} />
              <ChokurLogoComp variant="horizontal" size={32} />
            </div>
            <ChokurLogoComp variant="vertical" size={32} />
          </div>
        ),
      },
      {
        name: "GradeChip",
        description: "KCSE grade display with color coding (A–F, numeric)",
        variants: ["A", "B+", "C", "D", "E", "numeric"],
        preview: (
          <div className="flex flex-wrap items-center gap-2">
            <GradeChip grade="A" />
            <GradeChip grade="A-" />
            <GradeChip grade="B+" />
            <GradeChip grade="B" />
            <GradeChip grade="B-" />
            <GradeChip grade="C+" />
            <GradeChip grade="C" />
            <GradeChip grade="C-" />
            <GradeChip grade="D+" />
            <GradeChip grade="D" />
            <GradeChip grade="D-" />
            <GradeChip grade="E" />
          </div>
        ),
      },
      {
        name: "Sidebar",
        description: "Responsive navigation sidebar (rail + expanded)",
        badge: "App Layout",
        variants: ["rail (72px)", "expanded (200px)", "XL (220px)", "mobile drawer"],
        preview: (
          <div className="relative h-32 bg-card border border-border rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              Sidebar Component (requires GradingProvider context)
            </div>
          </div>
        ),
      },
      {
        name: "TopNavBar",
        description: "Fixed header with context selectors and status",
        badge: "App Layout",
        variants: ["desktop", "tablet", "mobile", "modals"],
        preview: (
          <div className="relative h-24 bg-card border border-border rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              TopNavBar Component (requires GradingProvider context)
            </div>
          </div>
        ),
      },
    ],
  },
];

// CSS animations for showcase (client-side only)
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
    .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
  `;
  document.head.appendChild(style);
}