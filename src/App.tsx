import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { AndroidDeviceShell } from './components/layout/AndroidDeviceShell';
import { AndroidBottomNav } from './components/layout/AndroidBottomNav';
import { HomeView } from './components/home/HomeView';
import { MenuView } from './components/menu/MenuView';
import { TableBookingView } from './components/booking/TableBookingView';
import { CartView } from './components/cart/CartView';
import { ProfileView } from './components/profile/ProfileView';
import { FoodDetailModal } from './components/menu/FoodDetailModal';
import { OrderTrackerModal } from './components/orders/OrderTrackerModal';
import { AuthModal } from './components/auth/AuthModal';
import { AppTab, MenuItem } from './types/restaurant';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [selectedFoodItem, setSelectedFoodItem] = useState<MenuItem | null>(null);
  const [showOrderTracker, setShowOrderTracker] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const { trackingOrder, activeOrder } = useRestaurant();

  // Handlers
  const handleOpenItemModal = (item: MenuItem) => {
    setSelectedFoodItem(item);
  };

  const handleOpenOrderTracker = () => {
    setShowOrderTracker(true);
  };

  return (
    <AndroidDeviceShell>
      {/* Dynamic Screen Content */}
      <div className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            onNavigateTab={setActiveTab}
            onOpenItemModal={handleOpenItemModal}
            onOpenOrderTracker={handleOpenOrderTracker}
          />
        )}

        {activeTab === 'menu' && (
          <MenuView
            onSelectItem={handleOpenItemModal}
            onNavigateToCart={() => setActiveTab('cart')}
          />
        )}

        {activeTab === 'booking' && (
          <TableBookingView />
        )}

        {activeTab === 'cart' && (
          <CartView
            onNavigateToMenu={() => setActiveTab('menu')}
            onOpenOrderTracker={handleOpenOrderTracker}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            onNavigateToMenu={() => setActiveTab('menu')}
            onOpenOrderTracker={handleOpenOrderTracker}
          />
        )}
      </div>

      {/* Android Bottom Navigation */}
      <AndroidBottomNav 
        activeTab={activeTab} 
        onSelectTab={setActiveTab} 
      />

      {/* Modals & Drawers */}
      {selectedFoodItem && (
        <FoodDetailModal
          item={selectedFoodItem}
          onClose={() => setSelectedFoodItem(null)}
        />
      )}

      {showOrderTracker && (trackingOrder || activeOrder) && (
        <OrderTrackerModal
          order={(trackingOrder || activeOrder)!}
          onClose={() => setShowOrderTracker(false)}
        />
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </AndroidDeviceShell>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RestaurantProvider>
          <MainAppContent />
        </RestaurantProvider>
      </CartProvider>
    </AuthProvider>
  );
}
