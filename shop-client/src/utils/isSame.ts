export const isSame = <T extends Object>(obj1: T, obj2: T) => {
	const obj1Keys = Object.keys(obj1);
	const obj2Keys = Object.keys(obj2);
	return (
		obj1Keys.length === obj2Keys.length &&
		obj1Keys.every(k => {
			const key = k as keyof T;
			return obj1[key] === obj2[key];
		})
	);
};
