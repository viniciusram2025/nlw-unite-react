import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface TTableCellProps extends ComponentProps<'td'> { }

export function TableCell(props: TTableCellProps) {
    return (
        <td className={twMerge('py-3 px-4 text-sm text-sinc-300', props.className)} {...props} />
    )
}