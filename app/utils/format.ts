type DateValue = string | number | Date | null | undefined;
type NumberValue = string | number | null | undefined;

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
});



export function formatDate(value: DateValue) {
	const date = toDate(value);
	return date ? dateFormatter.format(date) : '';
}

export function formatDateTime(value: DateValue) {
	const date = toDate(value);
	return date ? dateTimeFormatter.format(date) : '';
}

export function getMonthName(date: Date) {
	return date.toLocaleString('default', { month: 'long' });
}

export function toISODate(date: Date) {
	if(typeof date === 'string') date = new Date(date);
	return (date as Date).toLocaleDateString('fr-CA');
}

export function toLocaleDate(date: Date | String) {
	if(typeof date === 'string') date = new Date(date);
	return (date as Date).toLocaleDateString('ru-RU');
}



function toDate(value: DateValue) {
	if (!value) return null;

	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

function toNumber(value: NumberValue) {
	if (value === null || value === undefined || value === '') return null;

	const number = Number(value);
	return Number.isNaN(number) ? null : number;
}
