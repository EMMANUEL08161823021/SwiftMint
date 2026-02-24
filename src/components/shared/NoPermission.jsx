import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { StepBackIcon } from 'lucide-react';

export default function NoPermission() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-evenly mt-10">
      <div>
        <h2 className="text-7xl font-bold text-gray-700">304</h2>
        <p className="text-2xl font-semibold text-gray-600 mt-2">
          Access Denied
        </p>
        <p className="text-sm text-gray-500 mt-2 mb-8">
          We're sorry the page you're trying to access has restricted access.{' '}
          <br />
          Please refer to your{' '}
          <span className="font-semibold text-panel-red">
            system administration
          </span>
        </p>
        <Button
          variant={'primary'}
          sx={{ backgroundColor: '#ef4444', color: '#fff' }}
          onClick={() => router.push('/dashboard')}
        >
          <StepBackIcon className="mr-2" /> Go to Dashboard
        </Button>
      </div>
      <div>
        <img className="h-[600px]" src="/noPermission.svg" alt="No Entry" />
      </div>
    </div>
  );
}
