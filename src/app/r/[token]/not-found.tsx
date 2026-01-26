import Link from 'next/link';
import { FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
          <FileX className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Report Not Found</h1>
        <p className="text-gray-400 mb-6 max-w-md">
          This report may have been made private, the link may have expired, or it
          doesn&apos;t exist. Please check the URL or contact the report owner.
        </p>
        <Link href="https://plebtest.com">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Visit PlebTest
          </Button>
        </Link>
      </div>
    </div>
  );
}
