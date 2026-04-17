import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

type SearchableMultiSelectProps<T> = {
  placeholder?: string;
  triggerLabel?: string;
  searchPlaceholder: string;
  options?: T[];
  items?: T[];
  selectedIds?: string[];
  selectedKeys?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onChange?: (ids: string[]) => void;
  emptyText?: string;
  getOptionKey?: (item: T) => string;
  getOptionLabel?: (item: T) => string;
  getOptionSecondaryLabel?: (item: T) => string;
  getSearchText?: (item: T) => string;
};

export function SearchableMultiSelect<T>({
  placeholder,
  triggerLabel,
  searchPlaceholder,
  options,
  items,
  selectedIds,
  selectedKeys,
  onSelectionChange,
  onChange,
  emptyText = "No item matched.",
  getOptionKey,
  getOptionLabel,
  getOptionSecondaryLabel,
  getSearchText,
}: SearchableMultiSelectProps<T>) {
  const [searchValue, setSearchValue] = useState("");
  const resolvedOptions = useMemo(
    () => options || items || [],
    [items, options],
  );
  const resolvedSelectedIds = selectedIds || selectedKeys || [];
  const handleSelectionChange =
    onSelectionChange || onChange || (() => undefined);

  const filteredOptions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return resolvedOptions;
    }

    return resolvedOptions.filter((option) => {
      const searchText =
        getSearchText?.(option) ??
        getOptionLabel?.(option) ??
        `${(option as { name?: string; medicineName?: string }).name ?? ""} ${(option as { medicineName?: string }).medicineName ?? ""}`;

      return searchText.toLowerCase().includes(query);
    });
  }, [getOptionLabel, getSearchText, resolvedOptions, searchValue]);

  const resolveKey = (option: T) =>
    getOptionKey?.(option) ??
    ((option as { _id?: string; key?: string; name?: string })._id ||
      (option as { key?: string; name?: string }).key ||
      (option as { name?: string }).name ||
      String(option));

  const resolveLabel = (option: T) =>
    getOptionLabel?.(option) ??
    ((option as { name?: string; medicineName?: string }).name ||
      (option as { medicineName?: string }).medicineName ||
      resolveKey(option));

  const handleToggle = (option: T) => {
    const key = resolveKey(option);
    const isSelected = resolvedSelectedIds.includes(key);
    const nextIds = isSelected
      ? resolvedSelectedIds.filter((item) => item !== key)
      : [...resolvedSelectedIds, key];

    handleSelectionChange(nextIds);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
        >
          <span>{triggerLabel || placeholder || "Select items"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full space-y-2">
        <div className="px-1 pt-1">
          <Input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-8"
          />
        </div>
        {filteredOptions.length ? (
          filteredOptions.map((item) => {
            const key = resolveKey(item);
            const label = resolveLabel(item);
            const secondaryLabel = getOptionSecondaryLabel?.(item);

            return (
              <DropdownMenuCheckboxItem
                key={key}
                checked={resolvedSelectedIds.includes(key)}
                onSelect={(event) => event.preventDefault()}
                onCheckedChange={() => handleToggle(item)}
              >
                {secondaryLabel ? `${label} | ${secondaryLabel}` : label}
              </DropdownMenuCheckboxItem>
            );
          })
        ) : (
          <p className="px-3 py-2 text-sm text-muted-foreground">{emptyText}</p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
