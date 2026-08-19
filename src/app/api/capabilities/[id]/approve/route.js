import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import Capability from '@/models/Capability';

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (session.user.role !== 'manager') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await dbConnect();
  const capability = await Capability.findByIdAndUpdate(
    params.id,
    { status: 'certified', approvedBy: session.user.id, approvedAt: new Date() },
    { new: true }
  );

  if (!capability) {
    return NextResponse.json({ error: 'Capability not found' }, { status: 404 });
  }

  return NextResponse.json(capability);
}
