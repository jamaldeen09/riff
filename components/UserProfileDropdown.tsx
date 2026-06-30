"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { LogOut, User } from "lucide-react";

export function UserProfileDropdown() {
    const { user } = useUser();
    if (!user) return null;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="relative h-8 w-8 rounded-full ring-2 ring-transparent transition-all hover:ring-border focus-visible:outline-none focus-visible:ring-ring">
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={user.imageUrl}
                            alt={`${user.fullName ?? "riff-user"}'s profile picture`}
                        />
                        <AvatarFallback className="text-xs font-semibold">
                            {user.fullName?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64" align="end" sideOffset={8} forceMount>
                {/* Profile header */}
                <div className="flex items-center gap-3 px-3 py-3">
                    <Avatar className="h-7 w-7 shrink-0">
                        <AvatarImage
                            src={user.imageUrl}
                            alt={`${user.fullName ?? "riff-user"}'s profile picture`}
                        />
                        <AvatarFallback className="text-xs font-semibold">
                            {user.fullName?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-semibold leading-tight">
                            {user.fullName}
                        </span>
                        <span className="truncate text-xs text-muted-foreground leading-tight mt-0.5">
                            @{user.username}
                        </span>
                        <span className="truncate text-xs text-muted-foreground/70 leading-tight mt-0.5">
                            {user.primaryEmailAddress?.emailAddress}
                        </span>
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem >
                        <User className="h-4 w-4 text-muted-foreground" />
                        Profile
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <div className="p-1">

                    <SignOutButton>
                        <DropdownMenuItem
                            variant="destructive"
                        >
                            <LogOut className="h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </SignOutButton>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}