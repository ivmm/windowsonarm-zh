import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@fluentui/react-components";
import { Coffee, Github } from "lucide-react";
import {
  ClerkLoading,
  GoogleOneTap,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { SiDiscord } from "@icons-pack/react-simple-icons";

interface NavigationProps extends React.HTMLAttributes<HTMLDivElement> {}

const Navigation = ({ className, ...props }: NavigationProps) => {
  return (
    <>
      <div
        className={cn(
          "w-full flex justify-between items-center gap-2",
          className,
        )}
        {...props}
      >
        <div className={"space-x-4"}>
          <Link href="https://github.com/AwaitQuality/windowsonarm">
            <Button icon={<Github size={20} color={"#ADADAD"} />}>
              Contribute on Github
            </Button>
          </Link>
          <Link href="https://github.com/sponsors/OpenSource03">
            <Button icon={<Coffee size={20} color={"#ADADAD"} />}>
              Buy us a coffee
            </Button>
          </Link>
        </div>
        <div className={"flex gap-4 items-center"}>
          <Link href={"https://discord.gg/8EVWtctVEk"}>
            <SiDiscord />
          </Link>
          <ClerkLoading>
            <Button disabled>Loading...</Button>
          </ClerkLoading>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href="/auth/signin">
              <Button>Sign in</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
      <GoogleOneTap />
    </>
  );
};

export default Navigation;
