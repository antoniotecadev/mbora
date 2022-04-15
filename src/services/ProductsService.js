const PRODUCTS = [
    {
        id: 100,
        name: 'ReactProX Headset',
        price: 350,
        image: require('../../assets/products/feijao1.jpg'),
        description: 'A headset combines a headphone with microphone. Headsets are made with either a single-earpiece (mono) or a double-earpiece (mono to both ears or stereo).'
    },
    {
        id: 101,
        name: 'FastLane Toy Car',
        price: 600,
        image: require('../../assets/products/feijao2.jpg'),
        description: 'A model car, or toy car, is a miniature representation of an automobile. Other miniature motor vehicles, such as trucks, buses, or even ATVs, etc. are often included in this general category.'
    },
    {
        id: 102,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/oleo.jpg'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 103,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/massa.png'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 104,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/feijao1.jpg'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 105,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/feijao1.jpg'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 106,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/massa.png'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 107,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/oleo.jpg'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 108,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/feijao2.jpg'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 109,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/feijao1.jpg'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 110,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/feijao1.jpg'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 111,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/feijao1.jpg'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 112,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/oleo.jpg'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 113,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/massa.png'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 114,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/massa.png'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 115,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/massa.png'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 116,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/oleo.jpg'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 117,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/oleo.jpg'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 118,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/feijao1.jpg'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 119,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/feijao1.jpg'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 102,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/feijao2.jpg'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 120,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/feijao2.jpg'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 121,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/oleo.jpg'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
    {
        id: 122,
        name: 'SweetHome Cupcake',
        price: 2,
        image: require('../../assets/products/oleo.jpg'),
        description: 'A cupcake (also British English: fairy cake; Hiberno-English: bun; Australian English: fairy cake or patty cake[1]) is a small cake designed to serve one person.'
    },
];

export function getProducts() {
    return PRODUCTS;
}

export function getProduct(id) {
    return PRODUCTS.find((product) => (product.id == id));
}

