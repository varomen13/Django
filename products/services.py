from abc import ABC, abstractmethod


class DiscountStrategy(ABC):
    @abstractmethod
    def aplicar_descuento(self, precio):
        pass


class SinDescuento(DiscountStrategy):
    def aplicar_descuento(self, precio):
        return precio


class DescuentoElectronica(DiscountStrategy):
    def aplicar_descuento(self, precio):
        return precio * 0.90


class DescuentoRopa(DiscountStrategy):
    def aplicar_descuento(self, precio):
        return precio * 0.85


def obtener_estrategia(nombre_categoria):
    estrategias = {
        'Electronica': DescuentoElectronica(),
        'Electrónica': DescuentoElectronica(),
        'Ropa': DescuentoRopa(),
    }
    return estrategias.get(nombre_categoria, SinDescuento())


def calcular_precio_final(product):
    estrategia = obtener_estrategia(product.category.name)
    return estrategia.aplicar_descuento(float(product.price))