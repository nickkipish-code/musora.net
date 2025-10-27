# Waste Removal Service - Implemented Features

## Overview
This document describes the waste removal service implementation based on the requirements for a mobile app connecting residents with couriers for waste pickup.

## ✅ Completed Features

### 1. Client Flow (Resident/Client)

#### Order Creation
- **Number of bags/packages**: Users can specify how many bags to remove
- **Pickup time selection**: 
  - Immediate (30-60 minutes)
  - Today afternoon
  - Today evening
  - Tomorrow morning
- **Access type**: 
  - Elevator available
  - No elevator (stairs)
  - Private house
- **Door code**: Optional door access code
- **Comments**: Special instructions for courier ("bag at door", "call 5 min before", etc.)
- **Floor number**: Required for building navigation
- **Price calculation**: Dynamic pricing based on:
  - Waste type (STANDARD/RECYCLABLE/BULKY)
  - Number of bags (extra cost for additional bags)
  - Floor and access type (surcharge for stairs)

#### Payment System
- **Payment method selection**: Credit card, cash, subscription
- **Order details preview**: Shows all order information before payment
- **Payment processing**: Integration ready for Monobank, LiqPay, or Stripe

#### Order Tracking
- **Real-time status updates**:
  - "Created" - Order placed
  - "Courier accepted" - Courier took the order
  - "En route" - Courier is traveling
  - "Arrived" - Courier is at location
  - "Completed" - Waste picked up
- **Contact courier**: Call or message courier directly
- **Order details**: View all order information including bags count, access type, door code, pickup time

#### Rating System
- **Post-order rating**: 1-5 stars with optional comment
- **Review interface**: Star selection and feedback form
- **Quality assurance**: Helps improve service and motivate couriers

#### Bonus/Loyalty System
- **Progress tracking**: Shows completed orders count
- **Free orders**: "10 orders = 1 free" system
- **Visual progress**: Progress bar showing proximity to free order
- **Bonus orders earned**: Displays accumulated free orders

### 2. Courier Flow

#### Order Acceptance
- **Nearby orders**: Displays orders in vicinity
- **Order details**: Shows all relevant information
  - Address
  - Floor
  - Number of bags
  - Access type
  - Door code
  - Comments
- **Accept order**: One-click to take the order

#### Status Management
- **Status progression**:
  1. **Accepted**: Courier takes the order
  2. **En Route**: Courier clicks "In route" button
  3. **Arrived**: Courier marks as "On location"
  4. **Completed**: Courier marks waste as picked up
- **Automatic notifications**: Client receives real-time updates

#### Earnings Tracking
- **Daily statistics**: Shows completed orders and earnings
- **Balance updates**: Real-time earnings after each order
- **Order history**: View all completed orders

### 3. Database Schema Updates

#### Enhanced Order Model
```prisma
model Order {
  bagsCount   Int    // Number of bags/packages
  pickupTime  String // IMMEDIATE, AFTERNOON, EVENING, TOMORROW_MORNING
  accessType  String // ELEVATOR, STAIRS, PRIVATE_HOUSE
  doorCode    String // Door access code
  subscriptionId String // For recurring orders
  // ... other fields
}
```

#### Subscription Model
```prisma
model Subscription {
  userId      String
  name        String
  planType    String // DAILY, EVERY_3_DAYS, WEEKLY, MONTHLY
  price       Int
  ordersLimit Int
  ordersUsed  Int
  isActive    Boolean
  // ... timestamps
}
```

#### User Enhancements
```prisma
model User {
  loyaltyPoints Int // For bonus system
  bonusOrders   Int // Free orders earned
  subscriptions Subscription[]
  // ... other fields
}
```

### 4. UI Enhancements

#### Order Creation Screen
- Dynamic fields based on requirements
- Real-time price calculation
- Better UX with emoji indicators
- Validation before submission

#### Payment Screen
- Shows order summary (bags, pickup time, access type)
- Payment method selection
- Important information display

#### Order Details Screen
- Complete order information
- Contact courier button (when active)
- Rate order button (when completed)
- Status badge with colors

#### Courier Screen
- Multiple status action buttons
- Active orders section
- Available orders section
- Statistics display

#### Home Screen
- Bonus system indicator
- Progress tracking
- Subscription quick access (to be implemented)

## 🚧 Pending Features

### 1. Subscription System
- **Subscription plans**: Daily, weekly, monthly options
- **Automatic scheduling**: Pre-scheduled waste pickup
- **Payment integration**: Monthly subscription billing
- **Cancel/subscribe**: Easy plan management

### 2. Enhanced Bonus/Loyalty
- **Automatic calculation**: Track orders across all time
- **Free order redemption**: Use bonus orders
- **Bonus notification**: Alert when free order earned

### 3. Admin Panel Enhancements
- **Rate management**: Per-floor, time, weight pricing
- **Subscription management**: View/edit subscriber plans
- **Statistics dashboard**: Metrics and analytics
- **Courier tracking**: Real-time courier location on map
- **Review management**: View and respond to reviews

### 4. Notifications
- **Push notifications**: Firebase Cloud Messaging
- **Status updates**: Real-time order status
- **Schedule reminders**: "Time to take out trash"
- **Courier alerts**: "Courier is on the way"

### 5. Payment Integration
- **Monobank API**: Ukrainian payment integration
- **LiqPay integration**: Alternative payment method
- **Stripe integration**: International payment option

### 6. Advanced Features
- **Photo upload**: Before/after pickup photos
- **Chat system**: Direct communication between client and courier
- **Multiple addresses**: Save "Home", "Office", "Cottage"
- **Google Maps integration**: Address selection and routing

## 📱 Technical Stack

- **Frontend**: React Native (TypeScript)
- **Backend**: NestJS (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Supabase Auth
- **Maps**: Google Maps API / OpenStreetMap
- **Payments**: Monobank / LiqPay / Stripe (ready for integration)
- **Notifications**: Firebase Cloud Messaging (ready for integration)

## 🎯 Key Workflows

### Client Workflow
1. Select address (map or current location)
2. Choose waste type and pickup time
3. Specify bags count, floor, access type
4. Add comments
5. Review and pay
6. Track courier in real-time
7. Contact courier if needed
8. Rate after completion
9. Earn loyalty points

### Courier Workflow
1. Sign in as courier (verification required)
2. Go online and see nearby orders
3. Accept suitable orders
4. Navigate to pickup location
5. Update status (En route → Arrived)
6. Pick up waste
7. Mark as completed
8. Receive payment
9. View earnings

### Admin Workflow
1. Login to admin panel
2. View all orders and statuses
3. Track couriers on map
4. Set rates and pricing
5. Manage subscriptions
6. View statistics and reviews
7. Moderate content

## 🔄 Status Flow

```
PENDING → ASSIGNED → EN_ROUTE → ARRIVED → DONE
                            ↓
                         ACCEPTED
```

## 💰 Pricing Model

### Base Prices
- STANDARD: 50 ₴
- RECYCLABLE: 75 ₴
- BULKY: 100 ₴

### Additional Charges
- Extra bags: +20 ₴ per additional bag
- No elevator: +10 ₴ per floor

### Example Calculations
- 3 bags, 5th floor, no elevator, STANDARD:
  - Base: 50 ₴
  - Extra bags: (3-1) × 20 = 40 ₴
  - Floor surcharge: 5 × 10 = 50 ₴
  - Total: 140 ₴

## 📊 Bonus System

- **Loyalty points**: 1 point per completed order
- **Free order**: Every 10 orders = 1 free order
- **Progress tracking**: Visual progress bar on home screen
- **Bonus display**: Shows how many free orders earned

## 🎨 UI/UX Features

- **Modern design**: Clean, intuitive interface
- **Gold/Cream theme**: Elegant color scheme
- **Emoji indicators**: Visual cues for different sections
- **Progress tracking**: Visual feedback for users
- **Real-time updates**: Live status changes
- **Accessible**: Proper labels for screen readers

## 🚀 Deployment

- **Backend**: NestJS app running on server
- **Mobile**: React Native app for Android/iOS
- **Admin**: Next.js web panel
- **Database**: PostgreSQL with Prisma migrations

## 📝 Next Steps

1. Complete subscription flow integration
2. Add bonus system backend logic
3. Implement push notifications
4. Connect payment gateways
5. Add photo upload functionality
6. Enhance admin panel with statistics
7. Add chat/messaging system
8. Implement Google Maps routing
9. Add multiple saved addresses
10. Complete Firebase setup for notifications

