export const getDifferentValues = <T extends object>(obj1: T, obj2: T) => {
	const fields: Record<any, any> = {};

	Object.keys(obj1).forEach(k => {
		const key = k as keyof T;

		if (obj1[key] !== obj2[key]) fields[key] = obj2[key];
	});

	return fields;
};
