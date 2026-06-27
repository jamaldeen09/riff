"use client"
import { Show, SignUpButton } from "@clerk/nextjs";
import { Fragment } from "react/jsx-runtime";
import { Button } from "./ui/button";

export default function AuthButtons() {
    return (
        <Fragment>
            <Show when="signed-out">
                <SignUpButton mode="modal">
                    <Button size="lg" variant="outline">Sign In</Button>
                </SignUpButton>
            </Show>

            <Show when="signed-out">
                <SignUpButton mode="modal">
                    <Button size="lg">Sign Up</Button>
                </SignUpButton>
            </Show>
        </Fragment>
    )
}