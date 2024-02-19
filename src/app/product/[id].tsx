import { Feather } from "@expo/vector-icons"
import { Image, Text, View } from "react-native"
import { Redirect, useLocalSearchParams, useNavigation } from "expo-router"
import { Button } from "@/src/components/button"
import { LinkButton } from "@/src/components/link-button"
import { useCartStore } from "@/src/stores/cart-store"
import { PRODUCTS } from "@/src/utils/data/products"
import { formatCurrency } from "@/src/utils/functions/format-currency"

export default function Product() {
  const navigation = useNavigation()
  const { id } = useLocalSearchParams()
  const cartStore = useCartStore()

  const product = PRODUCTS.find((item) => item.id === id)

  function handleAddToCart() {
    cartStore.add(product!)
    navigation.goBack()
  }

  if (!product) return <Redirect href="/" />

  return (
    <View className="flex-1">
      <Image source={product.cover} resizeMode="cover" className="w-full h-52" />

      <View className="p-5 mt-8 flex-1">
        <Text className="text-white text-xl font-heading">
          {product.title}
        </Text>

        <Text className="text-lime-400 text-2xl font-heading my-2">
          {formatCurrency(product.price)}
        </Text>

        <Text className="text-slate-400 font-body text-base leading-6 mb-6">
          {product.description}
        </Text>

        {product.ingredients.map((ingredient) => (
          <Text key={ingredient} className="text-slate-400 font-body text-base leading-6">
            {"\u2022"} {" "} {ingredient}
          </Text>
        ))}
      </View>

      <View className="p-5 pb-8 gap-5">
        <Button onPress={handleAddToCart}>
          <Button.Icon>
            <Feather name="plus-circle" size={20} />
          </Button.Icon>

          <Button.Text>
            Adicionar ao pedido
          </Button.Text>
        </Button>

        <LinkButton title="Voltar ao cardápio" href="/" />
      </View>
    </View>
  )
}
