import { Dropdown } from '..';
import { MAX_BUDGET } from '../../data/constants';
import { FilterProps } from '../../hooks';
import { DropdownItem } from '../dropdown';

export const FilterOptions: React.FC<Omit<FilterProps, 'onPageChange'>> = ({
	filter,
	onBudgetChange,
	onPerPageChange,
	onSortChange,
}) => {
	return (
		<>
			<Dropdown label="Sort">
				<DropdownItem
					label="Ascending"
					value="asc"
					onValueChange={onSortChange}
					active={filter.sort === 'asc'}
				/>
				<DropdownItem
					label="Descending"
					value="desc"
					onValueChange={onSortChange}
					active={filter.sort === 'desc'}
				/>
			</Dropdown>
			<Dropdown label="Per page">
				<DropdownItem
					label="2"
					value={2}
					onValueChange={onPerPageChange}
					active={filter.limit === 2}
				/>
				<DropdownItem
					value={4}
					label="4"
					onValueChange={onPerPageChange}
					active={filter.limit === 4}
				/>
				<DropdownItem
					value={6}
					label="6"
					onValueChange={onPerPageChange}
					active={filter.limit === 6}
				/>
				<DropdownItem
					value={8}
					label="8"
					onValueChange={onPerPageChange}
					active={filter.limit === 8}
				/>
			</Dropdown>
			<Dropdown label="Budget">
				<DropdownItem
					value={MAX_BUDGET}
					label="None"
					onValueChange={onBudgetChange}
					active={filter.budget === MAX_BUDGET}
				/>
				<DropdownItem
					label="< 100"
					value={100}
					onValueChange={onBudgetChange}
					active={filter.budget === 100}
				/>
				<DropdownItem
					value={500}
					label="< 500"
					onValueChange={onBudgetChange}
					active={filter.budget === 500}
				/>
				<DropdownItem
					value={1000}
					label="< 1000"
					onValueChange={onBudgetChange}
					active={filter.budget === 1000}
				/>
				<DropdownItem
					value={2000}
					label="< 2000"
					onValueChange={onBudgetChange}
					active={filter.budget === 2000}
				/>
			</Dropdown>
		</>
	);
};
