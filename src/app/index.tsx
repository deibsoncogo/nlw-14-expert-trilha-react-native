import { useRef, useState } from "react"
import { FlatList, SectionList, Text, View } from "react-native"
import { Link } from "expo-router"
import { CategoryButton } from "../components/category-button"
import { Header } from "../components/header"
import { Product } from "../components/product"
import { useCartStore } from "../stores/cart-store"
import { CATEGORIES, MENU } from "../utils/data/products"

export default function Home() {
  const [category, setCategory] = useState(CATEGORIES[0])
  const sectionListRef = useRef<SectionList>(null)

  const cartStore = useCartStore()

  const cartQuantityItems = cartStore.products.reduce((total, product) => {
    return total + product.quantity
  }, 0)

  function handleCategorySelect(selectedCategory: string) {
    setCategory(selectedCategory)

    const sectionIndex = CATEGORIES.findIndex((item) => item === selectedCategory)

    if (sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        animated: true, itemIndex: 0, sectionIndex,
      })
    }
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Faça seu pedido" cartQuantityItems={cartQuantityItems} />

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <CategoryButton
            title={item}
            isSelected={item === category}
            onPress={() => handleCategorySelect(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
        className="max-h-10 mt-5"
      />

      <SectionList
        ref={sectionListRef}
        sections={MENU}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <Link asChild href={`/product/${item.id}`}>
            <Product data={item} />
          </Link>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-xl text-white font-heading mt-8 mb-3">
            {title}
          </Text>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="flex-1 p-5"
      />
    </View>
  )
}
