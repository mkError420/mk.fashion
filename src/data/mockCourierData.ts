import { CourierTrackingInfo, CourierPartner } from '../types';

export const SAMPLE_TRACKING_CODES: Record<string, CourierTrackingInfo> = {
  'ST-9821415': {
    courier: 'Steadfast Courier',
    trackingCode: 'ST-9821415',
    consignmentId: 'CNS-ST-7721849',
    status: 'Out for Delivery',
    estimatedDelivery: 'Today by 6:00 PM',
    riderName: 'Md. Rafiqul Islam (Steadfast Rider #402)',
    riderPhone: '01712-349812',
    hubLocation: 'Dhanmondi Hub, Dhaka 1209',
    checkpoints: [
      {
        date: 'Today',
        time: '09:30 AM',
        title: 'Out for Delivery with Courier Rider',
        location: 'Dhanmondi Hub (Delivery Area: Road 27, Dhanmondi)',
        description: 'Assigned to delivery agent Md. Rafiqul Islam. Cash to collect: ৳3,510 (Cash on Delivery).',
        completed: true,
        current: true
      },
      {
        date: 'Today',
        time: '06:15 AM',
        title: 'Arrived at Destination Sorting Hub',
        location: 'Dhaka South Central Sorting Hub',
        description: 'Parcel sorted into Route 14 batch for morning delivery dispatch.',
        completed: true,
        current: false
      },
      {
        date: 'Yesterday',
        time: '08:45 PM',
        title: 'In-Transit Between Mother Hub & Local Hub',
        location: 'Tejgaon Central Mother Hub, Dhaka',
        description: 'Dispatched via secure vehicle transit #TR-8192.',
        completed: true,
        current: false
      },
      {
        date: 'Yesterday',
        time: '02:30 PM',
        title: 'Picked Up by Steadfast Courier',
        location: 'Aristo Central Warehouse, Banani',
        description: 'Parcel received, weighed (0.65 kg), and scanned into Steadfast network.',
        completed: true,
        current: false
      },
      {
        date: 'Yesterday',
        time: '11:00 AM',
        title: 'Consignment Created by Merchant',
        location: 'Aristo Fashion Online Operations',
        description: 'Shipping label printed and barcode registered with Steadfast API.',
        completed: true,
        current: false
      }
    ]
  },
  'PT-882194': {
    courier: 'Pathao Logistics',
    trackingCode: 'PT-882194',
    consignmentId: 'PATHAO-EXP-99214',
    status: 'In Sorting Hub',
    estimatedDelivery: 'Tomorrow afternoon',
    riderName: 'En route to sorting branch',
    riderPhone: '01911-887766',
    hubLocation: 'Agrabad Branch, Chattogram',
    checkpoints: [
      {
        date: 'Today',
        time: '02:10 PM',
        title: 'Reached Regional Sorting Hub',
        location: 'Agrabad Hub, Chattogram',
        description: 'Package scanned at Chattogram inbound cargo bay.',
        completed: true,
        current: true
      },
      {
        date: 'Yesterday',
        time: '11:40 PM',
        title: 'Dispatched via Highway Express Line',
        location: 'Dhaka - CTG Highway Transit',
        description: 'Night freight departure from Dhaka South Hub.',
        completed: true,
        current: false
      },
      {
        date: 'Yesterday',
        time: '04:15 PM',
        title: 'Picked Up by Pathao Courier Agent',
        location: 'Aristo Warehouse, Dhaka',
        description: 'Successfully picked up from merchant.',
        completed: true,
        current: false
      }
    ]
  },
  'RDX-472019': {
    courier: 'RedX Delivery',
    trackingCode: 'RDX-472019',
    consignmentId: 'RDX-BD-558832',
    status: 'Delivered',
    estimatedDelivery: 'Delivered on Sep 19',
    riderName: 'Tanvir Ahmed (RedX Delivery Hero)',
    riderPhone: '01822-441199',
    hubLocation: 'Uttara Sector 7 Hub, Dhaka',
    checkpoints: [
      {
        date: 'Sep 19',
        time: '04:20 PM',
        title: 'Delivered & Cash Collected',
        location: 'Uttara Sector 7, Dhaka',
        description: 'Customer received package. Cash on Delivery collection confirmed: ৳4,310.',
        completed: true,
        current: true
      },
      {
        date: 'Sep 19',
        time: '11:15 AM',
        title: 'Out for Delivery',
        location: 'Uttara Hub',
        description: 'Rider Tanvir Ahmed out on delivery route.',
        completed: true,
        current: false
      },
      {
        date: 'Sep 18',
        time: '05:00 PM',
        title: 'Picked Up from Aristo Fashion',
        location: 'Dhaka Dispatch Center',
        description: 'Barcode verified and sealed.',
        completed: true,
        current: false
      }
    ]
  }
};

export const SAMPLE_TRACKING_LIST: CourierTrackingInfo[] = Object.values(SAMPLE_TRACKING_CODES);

export function generateMockTrackingForOrder(orderId: string, courier: CourierPartner, district: string): CourierTrackingInfo {
  const isDhaka = district.toLowerCase().includes('dhaka');
  const codePrefix = courier === 'Steadfast Courier' ? 'ST' : courier === 'Pathao Logistics' ? 'PT' : courier === 'RedX Delivery' ? 'RDX' : 'PFLY';
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const trackingCode = `${codePrefix}-${randomNum}`;
  const consignmentId = `CNS-${codePrefix}-${orderId.replace(/[^0-9]/g, '')}`;

  return {
    courier,
    trackingCode,
    consignmentId,
    status: 'Order Placed',
    estimatedDelivery: isDhaka ? 'Within 24-48 Hours' : 'Within 2-4 Business Days',
    hubLocation: isDhaka ? 'Dhaka Central Hub' : `${district} Regional Dispatch Center`,
    checkpoints: [
      {
        date: 'Today',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Order Confirmed - Packaging in Progress',
        location: 'Aristo Fashion Fulfillment Center, Dhaka',
        description: `Order successfully placed with Cash on Delivery. Consignment registered with ${courier}. Ready for courier pickup handover.`,
        completed: true,
        current: true
      },
      {
        date: 'Pending',
        time: '--:--',
        title: `Pickup by ${courier} Fleet`,
        location: 'Banani Central Hub, Dhaka',
        description: 'Courier rider will collect package from warehouse and generate transit scan.',
        completed: false,
        current: false
      },
      {
        date: 'Pending',
        time: '--:--',
        title: 'In-Transit to Destination Hub',
        location: isDhaka ? 'Local Area Sorting Center' : `${district} Hub`,
        description: 'Package routed through central sorting facilities.',
        completed: false,
        current: false
      },
      {
        date: 'Pending',
        time: '--:--',
        title: 'Out for Doorstep Delivery',
        location: 'Assigned to Local Rider',
        description: 'Courier agent will arrive at your address with your parcel. Keep exact cash ready.',
        completed: false,
        current: false
      }
    ]
  };
}
