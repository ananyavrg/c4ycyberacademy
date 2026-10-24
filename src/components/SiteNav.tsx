import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, LayoutGrid, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sampleUser } from "@/data/sample";

export function SiteNav() {
  const navigate = useNavigate();
  const name = `${sampleUser.firstName} ${sampleUser.lastName}`;
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="truncate font-semibold tracking-tight">
          C4Y <span className="text-primary">CyberAcademy</span>
        </Link>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
            aria-label="Open your dashboard"
          >
            <img src={sampleUser.avatar} alt="" width={32} height={32} className="h-8 w-8 rounded-full object-cover ring-2 ring-border" />
            <span className="hidden text-sm font-medium sm:inline">{name}</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              aria-label="Open profile menu"
            >
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={() => navigate({ to: "/dashboard" })}>
                <User className="mr-2 h-4 w-4" /> Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate({ to: "/pathways" })}>
                <LayoutGrid className="mr-2 h-4 w-4" /> Pathways
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate({ to: "/" })}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
