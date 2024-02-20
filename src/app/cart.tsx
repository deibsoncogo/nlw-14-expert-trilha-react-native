import { Feather } from "@expo/vector-icons"
import { useState } from "react"
import { Alert, Linking, ScrollView, Text, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useNavigation } from "expo-router"
import { Button } from "../components/button"
import { Header } from "../components/header"
import { Input } from "../components/input"
import { LinkButton } from "../components/link-button"
import { Product } from "../components/product"
import { ProductCartProps, useCartStore } from "../stores/cart-store"
import { formatCurrency } from "../utils/functions/format-currency"

export default function Cart() {
  const [address, setAddress] = useState("")

  const cartStore = useCartStore()
  const navigation = useNavigation()

  const phoneNumber = process.env.EXPO_PUBLIC_PHONE_NUMBER_WHATS_APP

  const total = formatCurrency(cartStore.products.reduce((acc, product) => {
    return acc + product.price * product.quantity
  }, 0))

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [
      { text: "Cancelar" },
      { text: "Remover", onPress: () => cartStore.remove(product.id) },
    ])
  }

  function handleOrder() {
    if (address.trim().length === 0) {
      return Alert.alert("Pedido", "Informe o endereço da emprega")
    }

    const products = cartStore.products
      .map((product) => `\n ${product.quantity} ${product.title}`)
      .join("")

    const message = `NOVO PEDIDO\n\nEntregar em: ${address}\n${products}\n\n\n*Valor total: ${total}*`

    Linking.openURL(`http://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`)

    cartStore.clear()
    navigation.goBack()
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Seu carrinho" />

      <KeyboardAwareScrollView extraHeight={100} showsVerticalScrollIndicator={false}>
        <ScrollView>
          <View className="py-5 flex-1 border-b border-slate-700 mx-5">
            {cartStore.products.length > 0 ? (
              <>
                <View className="border-b border-slate-700 pb-2">
                  {cartStore.products.map((product) => (
                    <Product
                      key={product.id}
                      data={product}
                      onPress={() => handleProductRemove(product)}
                    />
                  ))}
                </View>

                <View className="flex-row gap-2 items-center mt-2 mb-4">
                  <Text className="text-white text-xl font-subtitle">
                    Total:
                  </Text>

                  <Text className="text-lime-400 text-2xl font-heading">
                    {total}
                  </Text>
                </View>

                <Input
                  onChangeText={setAddress}
                  blurOnSubmit
                  returnKeyType="next"
                  onSubmitEditing={handleOrder}
                  placeholder="Informe o endereço de entrega com rua, número, bairro e complemento"
                />
              </>
            ) : (
              <Text className="font-body text-slate-400 text-center my-8">
                Seu carrinho está vazio
              </Text>
            )}
          </View>

          <View className="p-5 gap-5">
            {cartStore.products.length > 0 && (
              <Button onPress={handleOrder}>
                <Button.Text>
                  Enviar pedido
                </Button.Text>

                <Button.Icon>
                  <Feather name="arrow-right-circle" size={20} />
                </Button.Icon>
              </Button>
            )}

            <LinkButton title="Voltar ao cardápio" href="/" />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

    </View>
  )
}
