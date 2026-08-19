import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import Capability from '@/models/Capability';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  // Employees only ever see their own records, regardless of query params —
  // enforced here, not just hidden in the UI.
  const { searchParams } = new URL(request.url);
  const requestedEmployeeId = searchParams.get('employeeId');

  const filter = {};
  if (session.user.role === 'employee') {
    filter.employee = session.user.id;
  } else if (requestedEmployeeId) {
    filter.employee = requestedEmployeeId;
  }

  const capabilities = await Capability.find(filter).lean();
  return NextResponse.json(capabilities);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { deviceId } = await request.json();
  if (!deviceId) {
    return NextResponse.json({ error: 'deviceId is required' }, { status: 400 });
  }

  await dbConnect();

  // Upsert: re-requesting an already-certified repair drops it back to pending
  // for re-review rather than creating a duplicate record.
  const capability = await Capability.findOneAndUpdate(
    { employee: session.user.id, device: deviceId },
    { status: 'pending', approvedBy: null, approvedAt: null },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return NextResponse.json(capability, { status: 201 });
}
