import React from 'react';
import { useController } from 'react-hook-form';
import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField';
import { UseControllerProps } from 'react-hook-form/dist/types';

export function TextField<T>(props: UseControllerProps<T> & TextFieldProps) {
	const {
		name,
		rules,
		shouldUnregister,
		defaultValue,
		control,
		...textFieldProps
	} = props;

	const {
		field: { ref, ...inputProps },
		fieldState: { error },
	} = useController({ name, rules, defaultValue, control, shouldUnregister });

	return (
		<MuiTextField
			inputRef={ref}
			{...inputProps}
			{...textFieldProps}
			helperText={error ? error.message : undefined}
			error={error !== undefined}
		/>
	);
}

export default TextField;
