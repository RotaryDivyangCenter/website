import CampsClient from './CampsClient';
import { getStats } from '@/utils/getStats';
import { getCamps } from '@/utils/getCamps';

export const dynamic = 'force-dynamic';

export default async function CampsPage() {
    const [stats, camps] = await Promise.all([getStats(), getCamps()]);
    return <CampsClient stats={stats} campList={camps} />;
}

