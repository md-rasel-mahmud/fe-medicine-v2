import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "./ui/button";
import { Printer } from "lucide-react";
import type { ReactNode } from "react";

interface PrintButtonProps {
  children: ReactNode;
  printTitle?: string;
  buttonLabel?: string;
  className?: string;
}

export function PrintButton({
  children,
  printTitle = "Print",
  buttonLabel = "Print Invoice",
  className = "",
}: PrintButtonProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: printTitle,
  });

  return (
    <div>
      <div className="print:hidden mb-4 fixed top-24 right-10 z-50">
        <Button onClick={handlePrint} className={className + " shadow"}>
          <Printer className="mr-2 h-4 w-4" /> {buttonLabel}
        </Button>
      </div>

      <div ref={printRef} className="m-2">
        {children}
      </div>
    </div>
  );
}
