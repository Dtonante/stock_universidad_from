export const navigations = [
  { name: "Dashboard", path: "/dashboard/default", icon: "dashboard" },
  { label: "OPCIONES", type: "label" },
  {
    name: "Productos",
    icon: "star",
    children: [
      { name: "Gestion De Productos", iconText: "concierge", path: "/products" }
    ]
  },
  
];
