export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

export const menuItems: MenuItem[] = [
  // Signature Bebek - Paket Nasi
  { id: 'b1', name: 'Nasi Bebek Goreng', price: 30000, category: 'Signature Bebek - Paket Nasi', image: '' },
  { id: 'b2', name: 'Nasi Bebek Bakar', price: 33000, category: 'Signature Bebek - Paket Nasi', image: '' },
  { id: 'b3', name: 'Nasi Bebek Bumbu Hitam', price: 33000, category: 'Signature Bebek - Paket Nasi', image: '' },
  
  // Tanpa Nasi - Bebek
  { id: 'b4', name: 'Bebek Goreng', price: 26000, category: 'Bebek - Tanpa Nasi', image: '' },
  { id: 'b5', name: 'Bebek Bakar', price: 29000, category: 'Bebek - Tanpa Nasi', image: '' },
  { id: 'b6', name: 'Bebek Bumbu Hitam', price: 29000, category: 'Bebek - Tanpa Nasi', image: '' },
  
  // Penyet Sambal Terasi
  { id: 'b7', name: 'Bebek Goreng Penyet', price: 26000, category: 'Penyet Sambal Terasi', image: '' },

  // Ayam - Paket Nasi
  { id: 'a1', name: 'Nasi Ayam Kampung Goreng', price: 25000, category: 'Ayam - Paket Nasi', image: '' },
  { id: 'a2', name: 'Nasi Ayam Kampung Bakar', price: 28000, category: 'Ayam - Paket Nasi', image: '' },
  { id: 'a3', name: 'Nasi Ayam Kampung Hitam', price: 28000, category: 'Ayam - Paket Nasi', image: '' },
  { id: 'a4', name: 'Nasi Ayam Goreng', price: 21000, category: 'Ayam - Paket Nasi', image: '' },
  { id: 'a5', name: 'Nasi Ayam Bakar', price: 24000, category: 'Ayam - Paket Nasi', image: '' },
  { id: 'a6', name: 'Nasi Ayam Bumbu Hitam', price: 24000, category: 'Ayam - Paket Nasi', image: '' },

  // Ayam - Tanpa Nasi
  { id: 'a7', name: 'Ayam Kampung Goreng', price: 21000, category: 'Ayam - Tanpa Nasi', image: '' },
  { id: 'a8', name: 'Ayam Kampung Bakar', price: 24000, category: 'Ayam - Tanpa Nasi', image: '' },
  { id: 'a9', name: 'Ayam Kampung Hitam', price: 24000, category: 'Ayam - Tanpa Nasi', image: '' },
  { id: 'a10', name: 'Ayam Goreng', price: 17000, category: 'Ayam - Tanpa Nasi', image: '' },
  { id: 'a11', name: 'Ayam Bakar', price: 20000, category: 'Ayam - Tanpa Nasi', image: '' },
  { id: 'a12', name: 'Ayam Bumbu Hitam', price: 20000, category: 'Ayam - Tanpa Nasi', image: '' },

  // Lele - Paket Nasi
  { id: 'l1', name: 'Nasi Lele Goreng', price: 16000, category: 'Lele - Paket Nasi', image: '' },
  { id: 'l2', name: 'Nasi Lele Bakar', price: 19000, category: 'Lele - Paket Nasi', image: '' },
  { id: 'l3', name: 'Nasi Lele Bumbu Hitam', price: 19000, category: 'Lele - Paket Nasi', image: '' },

  // Lele - Tanpa Nasi
  { id: 'l4', name: 'Lele Goreng', price: 12000, category: 'Lele - Tanpa Nasi', image: '' },
  { id: 'l5', name: 'Lele Bakar', price: 14000, category: 'Lele - Tanpa Nasi', image: '' },
  { id: 'l6', name: 'Lele Bumbu Hitam', price: 14000, category: 'Lele - Tanpa Nasi', image: '' },

  // Menu Tambahan
  { id: 't1', name: 'Telur Goreng Dadar', price: 8000, category: 'Menu Tambahan', image: '' },
  { id: 't2', name: 'Telur Goreng Ceplok', price: 8000, category: 'Menu Tambahan', image: '' },
  { id: 't3', name: 'Nasi Putih', price: 5000, category: 'Menu Tambahan', image: '' },
  { id: 't4', name: 'Nasi Uduk', price: 6000, category: 'Menu Tambahan', image: '' },
  { id: 't5', name: 'Cah Kangkung', price: 10000, category: 'Menu Tambahan', image: '' },
  { id: 't6', name: 'Cah Tauge', price: 10000, category: 'Menu Tambahan', image: '' },
  { id: 't7', name: 'Tempe Goreng/pcs', price: 3000, category: 'Menu Tambahan', image: '' },
  { id: 't8', name: 'Tahu Goreng/pcs', price: 3000, category: 'Menu Tambahan', image: '' },
  { id: 't9', name: 'Tempe Bakar/pcs', price: 4000, category: 'Menu Tambahan', image: '' },
  { id: 't10', name: 'Tahu Bakar/pcs', price: 4000, category: 'Menu Tambahan', image: '' },
  { id: 't11', name: 'Tempe Penyet/pcs', price: 4000, category: 'Menu Tambahan', image: '' },
  { id: 't12', name: 'Tahu Penyet/pcs', price: 4000, category: 'Menu Tambahan', image: '' },
  { id: 't13', name: 'Pete Goreng', price: 8000, category: 'Menu Tambahan', image: '' },
  { id: 't14', name: 'Sambal Bawang', price: 5000, category: 'Menu Tambahan', image: '' },
  { id: 't15', name: 'Sambal Terasi', price: 5000, category: 'Menu Tambahan', image: '' },
  { id: 't16', name: 'Sambal Ijo/Kuning', price: 5000, category: 'Menu Tambahan', image: '' },
  { id: 't17', name: 'Lalapan', price: 5000, category: 'Menu Tambahan', image: '' },
  { id: 't18', name: 'Kremesan', price: 3000, category: 'Menu Tambahan', image: '' },

  // Snack Beta
  { id: 's1', name: 'Tahu Crispy', price: 10000, category: 'Snack Beta', image: '' },
  { id: 's2', name: 'Jamur Crispy', price: 10000, category: 'Snack Beta', image: '' },
  { id: 's3', name: 'Cireng', price: 10000, category: 'Snack Beta', image: '' },
  { id: 's4', name: 'Pisang Goreng', price: 10000, category: 'Snack Beta', image: '' },
  { id: 's5', name: 'Pisang Kristal Coklat', price: 10000, category: 'Snack Beta', image: '' },
  { id: 's6', name: 'Pisang Kristal Keju', price: 12000, category: 'Snack Beta', image: '' },
  { id: 's7', name: 'Kentang Goreng Ori', price: 12000, category: 'Snack Beta', image: '' },
  { id: 's8', name: 'Kentang Goreng BBQ', price: 13000, category: 'Snack Beta', image: '' },
  { id: 's9', name: 'Kentang Goreng Keju', price: 13000, category: 'Snack Beta', image: '' },
  { id: 's10', name: 'Kentang Goreng Balado', price: 13000, category: 'Snack Beta', image: '' },

  // Minuman - Panas/Hot
  { id: 'm1', name: 'Teh Seje (Sere Jahe)', price: 10000, category: 'Minuman Panas/Hot', image: '' },
  { id: 'm2', name: 'Jahe Panas', price: 7000, category: 'Minuman Panas/Hot', image: '' },
  { id: 'm3', name: 'Jeruk Panas', price: 7000, category: 'Minuman Panas/Hot', image: '' },
  { id: 'm4', name: 'Teh Panas', price: 5000, category: 'Minuman Panas/Hot', image: '' },
  { id: 'm5', name: 'Kopi Hitam', price: 6000, category: 'Minuman Panas/Hot', image: '' },
  { id: 'm6', name: 'Kopi Susu', price: 7000, category: 'Minuman Panas/Hot', image: '' },

  // Minuman - Dingin/Es
  { id: 'm7', name: 'Es Beras Kencur', price: 8000, category: 'Minuman Dingin/Es', image: '' },
  { id: 'm8', name: 'Es Kunir Asam', price: 8000, category: 'Minuman Dingin/Es', image: '' },
  { id: 'm9', name: 'Es Sinom', price: 8000, category: 'Minuman Dingin/Es', image: '' },
  { id: 'm10', name: 'Es Jeruk', price: 9000, category: 'Minuman Dingin/Es', image: '' },
  { id: 'm11', name: 'Es Teh', price: 8000, category: 'Minuman Dingin/Es', image: '' },
  { id: 'm12', name: 'Milkshake Coklat', price: 14000, category: 'Minuman Dingin/Es', image: '' },
  { id: 'm13', name: 'Milkshake Strawberry', price: 14000, category: 'Minuman Dingin/Es', image: '' },

  // Mineral
  { id: 'm14', name: 'Mineral Sedang', price: 5000, category: 'Mineral', image: '' },
  { id: 'm15', name: 'Mineral Kecil', price: 3000, category: 'Mineral', image: '' }
];

export const getMenuItemsByCategory = () => {
  const grouped = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
  return grouped;
};
