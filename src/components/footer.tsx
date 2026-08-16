import { Logo } from "@/components/logo";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/brand-icons";

const socials = [
  { name: "GitHub", href: "https://github.com/pablofsj", Icon: GithubIcon },
  { name: "LinkedIn", href: "https://www.linkedin.com", Icon: LinkedinIcon },
  { name: "X", href: "https://x.com", Icon: XIcon },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 shadow-[0_-1px_2px_rgb(0_0_0/0.04)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-8 sm:flex-row sm:justify-between">
        <Logo compact />

        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Tech Solutions. Todos los derechos
          reservados.
        </p>

        <div className="flex gap-2">
          {socials.map(({ name, href, Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={name}
              title={name}
              className="grid size-9 place-items-center rounded-full border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground hover:shadow-md"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
