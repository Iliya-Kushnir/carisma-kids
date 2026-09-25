export type Category =
  | 'Дівчаткам'
  | 'Хлопчикам'
  | 'Костюми'
  | 'Верхній одяг'
  | 'Взуття'
  | 'Аксесуари'

export type ColorKey = 'black' | 'beige' | 'grey' | 'cream' | 'white'

export const COLOR_META: Record<ColorKey, { label: string; swatch: string }> = {
  black: { label: 'Чорний', swatch: '#1a1a1a' },
  beige: { label: 'Бежевий', swatch: '#cbb79c' },
  grey: { label: 'Сірий', swatch: '#9a9a9a' },
  cream: { label: 'Молочний', swatch: '#e8e2d4' },
  white: { label: 'Білий', swatch: '#f4f4f4' },
}

export type Product = {
  id: string
  title: string
  price: number
  image: string
  categories: Category[]
  sizes: string[]
  colors: ColorKey[]
}

export const CATEGORIES: Category[] = [
  'Дівчаткам',
  'Хлопчикам',
  'Костюми',
  'Верхній одяг',
  'Взуття',
  'Аксесуари',
]

export const SIZES = ['92', '98', '104', '110', '116', '122', '128']

export const PRODUCTS: Product[] = [
  {
    id: 'cool-happy',
    title: 'Костюм Cool & Happy',
    price: 1190,
    image: '/products/cool-happy-suit.png',
    categories: ['Хлопчикам', 'Костюми'],
    sizes: ['92', '98', '104', '110', '116'],
    colors: ['beige', 'cream', 'grey'],
  },
  {
    id: 'zip-hoodie',
    title: 'Худі на замку',
    price: 1090,
    image: '/products/black-zip-hoodie.png',
    categories: ['Хлопчикам', 'Дівчаткам'],
    sizes: ['98', '104', '110', '116', '122'],
    colors: ['black', 'grey'],
  },
  {
    id: 'demi-jacket',
    title: 'Куртка демісезонна',
    price: 1590,
    image: '/products/cream-puffer.png',
    categories: ['Верхній одяг', 'Хлопчикам', 'Дівчаткам'],
    sizes: ['104', '110', '116', '122', '128'],
    colors: ['cream', 'beige'],
  },
  {
    id: 'base-suit',
    title: 'Костюм Base',
    price: 1190,
    image: '/products/base-black-suit.png',
    categories: ['Хлопчикам', 'Костюми'],
    sizes: ['92', '98', '104', '110', '116'],
    colors: ['black'],
  },
  {
    id: 'ny-cap-beige',
    title: 'Кепка NY',
    price: 490,
    image: '/products/ny-cap-beige.png',
    categories: ['Аксесуари'],
    sizes: ['92', '98', '104', '110', '116', '122', '128'],
    colors: ['beige', 'black'],
  },
  {
    id: 'beige-knit',
    title: 'Костюм Beige Knit',
    price: 1190,
    image: '/products/beige-knit-suit.png',
    categories: ['Дівчаткам', 'Костюми'],
    sizes: ['92', '98', '104', '110'],
    colors: ['beige', 'cream'],
  },
  {
    id: 'white-sneakers',
    title: 'Кросівки White Basic',
    price: 990,
    image: '/products/white-sneakers.png',
    categories: ['Взуття'],
    sizes: ['110', '116', '122', '128'],
    colors: ['white'],
  },
  {
    id: 'ny-cap-black',
    title: 'Кепка NY Black',
    price: 490,
    image: '/products/ny-cap-black.png',
    categories: ['Аксесуари'],
    sizes: ['92', '98', '104', '110', '116', '122', '128'],
    colors: ['black'],
  },
  {
    id: 'grey-hoodie',
    title: 'Худі Basic Grey',
    price: 890,
    image: '/products/grey-hoodie.png',
    categories: ['Хлопчикам', 'Дівчаткам'],
    sizes: ['98', '104', '110', '116'],
    colors: ['grey'],
  },
  {
    id: 'black-tee',
    title: 'Футболка Essential',
    price: 490,
    image: '/products/black-tee.png',
    categories: ['Хлопчикам', 'Дівчаткам'],
    sizes: ['92', '98', '104', '110', '116', '122'],
    colors: ['black', 'white'],
  },
  {
    id: 'beige-coat',
    title: 'Пальто Wool Warm',
    price: 1990,
    image: '/products/beige-coat.png',
    categories: ['Верхній одяг', 'Дівчаткам'],
    sizes: ['104', '110', '116', '122', '128'],
    colors: ['beige'],
  },
  {
    id: 'black-boots',
    title: 'Черевики Winter',
    price: 1290,
    image: '/products/black-boots.png',
    categories: ['Взуття'],
    sizes: ['104', '110', '116', '122', '128'],
    colors: ['black'],
  },
]

export const PRICE_MIN = 0
export const PRICE_MAX = 2000

export function formatPrice(value: number) {
  return `${value.toLocaleString('uk-UA').replace(/,/g, ' ')} грн`
}
