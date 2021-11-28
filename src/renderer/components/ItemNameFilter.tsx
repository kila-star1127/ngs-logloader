import { Flex, FlexItem } from './Flex';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from './Button';
import { SquareBox } from './SquareBox';
import { TextInput } from './Input';

type ItemNameFilterProps = {
  onChange?(filter: string[]): void;
  filters: string[];
};
export const ItemNameFilter = React.memo<ItemNameFilterProps>(({ onChange, filters: _filters }) => {
  const [filters, setFilters] = useState<string[]>(_filters);
  const addNewFilter = useCallback(() => {
    setFilters((prev) => [...prev, '']);
  }, []);

  const removeFilter = useCallback((index: number) => {
    setFilters((prev) => {
      prev.splice(index, 1);

      if (prev.length == 0) return [''];

      return [...prev];
    });
  }, []);

  const changeFilter = useCallback((index: number, value: string) => {
    setFilters((prev) => {
      if (prev[index] != null) prev[index] = value;

      return [...prev];
    });
  }, []);

  useEffect(() => {
    onChange?.(filters);
  }, [filters, onChange]);

  return (
    <Flex direction="column" gap="5px">
      {filters.map((filter, index) => (
        <FlexItem key={index}>
          <FilterItem
            filter={filter}
            onRemove={() => removeFilter(index)}
            onChange={(value) => changeFilter(index, value)}
          />
        </FlexItem>
      ))}
      <FlexItem align="end">
        <SquareBox size={40}>
          <Button onClick={addNewFilter}>+</Button>
        </SquareBox>
      </FlexItem>
    </Flex>
  );
});

type FilterItemProps = {
  filter?: string;
  onRemove?(): void;
  onChange?(value: string): void;
};
const FilterItem = React.memo<FilterItemProps>(({ filter, onRemove, onChange }) => {
  const onChangeHandle = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      onChange?.(e.target.value);
    },
    [onChange],
  );
  return (
    <Flex gap="5px">
      <FlexItem grow={1}>
        <TextInput onChange={onChangeHandle} type="text" value={filter} />
      </FlexItem>
      <FlexItem>
        <SquareBox size={40}>
          <Button onClick={onRemove}>-</Button>
        </SquareBox>
      </FlexItem>
    </Flex>
  );
});
