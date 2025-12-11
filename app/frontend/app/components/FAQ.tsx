'use client';

import { Card, Collapse } from 'antd';

const { Panel } = Collapse;

export default function FAQ() {
  return (
    <Card
      title="Frequently Asked Questions"
      style={{
        marginBottom: 50,
        borderRadius: 12,
        boxShadow: '0 3px 16px rgba(0,0,0,0.07)',
      }}
    >
      <Collapse accordion>
        <Panel header="How do I book a resource?" key="1">
          Go to Browse Resources → Select → Pick a time slot → Book.
        </Panel>

        <Panel header="Can I cancel a booking?" key="2">
          Yes, go to My Bookings → Cancel.
        </Panel>

        <Panel header="Why was my booking rejected?" key="3">
          Resource may be unavailable or under maintenance.
        </Panel>
      </Collapse>
    </Card>
  );
}
