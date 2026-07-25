import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INPUT_TYPE, PASSWORD_VISIBILITY_LABEL } from "@/constants";
import { cn } from "@/helpers";

type PasswordInputProps = Omit<ComponentProps<"input">, "type">;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD}
        className={cn("pr-10", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute top-1/2 right-1 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
        onClick={() => setVisible((v) => !v)}
        aria-label={
          visible
            ? PASSWORD_VISIBILITY_LABEL.HIDE
            : PASSWORD_VISIBILITY_LABEL.SHOW
        }
        tabIndex={-1}
      >
        {visible ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}
