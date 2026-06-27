import { Show } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { UserProfileDropdown } from "../UserProfileDropdown";
import AuthButtons from "../AuthButtons";

export default async function Header() {
    return (
        <header className="mb-10 flex items-center justify-between">
            <h2 className="sr-only">Riff — live coding rooms lobby</h2>
            <div className="flex items-baseline gap-3">
                <span className="text-2xl font-semibold tracking-tight text-foreground">
                    Riff<span className="text-primary">.</span>
                </span>
                <span className="hidden text-xs text-muted-foreground sm:inline">
                    live coding rooms
                </span>
            </div>

            <div className="flex items-center gap-2">
                <Show when="signed-in">
                    <div className="flex items-center gap-2">
                        <Button size="lg">Create room</Button>
                        <UserProfileDropdown />
                    </div>
                </Show>

                <AuthButtons />
            </div>
        </header>
    )
}

