import { Children } from "react";
import { Separator } from "./ui/separator";

interface HeaderProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const Header: React.FC<HeaderProps> = ({ children, title, description }) => {
  return (
    <header className="space-y-4">
      <section>
        <h1 className="font-black text-4xl">{title}</h1>
        <p className="text-sm text-slate-700 dark:text-slate-400">
          {description}
        </p>
      </section>

      <section>{children}</section>

      <Separator className="bg-slate-300 dark:bg-slate-700" />
    </header>
  );
};

export default Header;
