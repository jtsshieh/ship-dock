import { GetServerSideProps } from 'next';
import { api } from './api';

export const generateGetServerSideProps = <
	ResourceName extends string,
	ResourceType
>(
	resource: string,
	resourceName: ResourceName = resource as ResourceName
) => {
	const getServerSideProps: GetServerSideProps<
		Record<ResourceName, ResourceType>
	> = async ({ req }) => {
		try {
			const resources: ResourceType = await api.get(resource, {
				cookies: req.headers.cookie,
			});
			return {
				props: { [resourceName]: resources } as Record<
					ResourceName,
					ResourceType
				>,
			};
		} catch {
			return {
				redirect: {
					destination: '/auth/login',
					permanent: false,
				},
			};
		}
	};
	return getServerSideProps;
};
