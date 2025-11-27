import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

const DataTest = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [items, tablesData] = await Promise.all([
          api.getMenuItems(),
          api.getTables()
        ]);
        setMenuItems(items);
        setTables(tablesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-yellow-900 bg-opacity-20 rounded-lg">
        <p className="text-yellow-400">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-900 bg-opacity-20 rounded-lg">
      <h3 className="text-green-400 font-bold mb-2">Data Loaded Successfully!</h3>
      <p>Menu Items: {menuItems.length}</p>
      <p>Tables: {tables.length}</p>
      <div className="mt-2">
        <h4 className="font-semibold">Sample Menu Items:</h4>
        {menuItems.slice(0, 3).map(item => (
          <div key={item._id} className="text-sm">
            {item.title} - Rs.{item.price}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataTest;