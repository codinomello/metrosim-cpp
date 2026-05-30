# MetroSim — Guia de Estilo

Este guia define as regras de arquitetura e estilo para o **MetroSim-SP**, um simulador em C++ inspirado na operação do Metrô de São Paulo.

O projeto será escrito com **C++ moderno, enxuto e pragmático**, usando orientação a objetos com moderação.

A ideia é aproveitar o melhor do C++:

* abstração útil
* encapsulamento claro
* segurança de memória
* performance previsível

Sem cair em excesso de complexidade.

O foco é manter o código:

* simples
* explícito
* eficiente
* fácil de debugar
* próximo da lógica operacional real de uma rede metroviária

---

# Filosofia do Projeto 🚇

O MetroSim-SP modela sistemas reais:

* estações
* trens
* conexões
* passageiros
* eventos operacionais

Cada entidade deve representar algo concreto do domínio.

Se uma abstração não melhora clareza ou organização, ela não deve existir.

---

# Princípios Gerais ✨

## Simplicidade acima de sofisticação

Prefira código claro a “esperteza”.

Ruim:

```cpp
auto&& station = *std::find_if(...);
```

Melhor:

```cpp
Station& station = stations_[index];
```

---

## OOP mínima e funcional

Classes devem existir apenas quando representam entidades naturais.

Exemplos válidos:

* `Station`
* `Train`
* `Graph`
* `Passenger`
* `Simulator`

Evite classes artificiais.

Ruim:

```cpp
StationManagerFactoryBuilder
```

Isso parece nome de consultoria, não de simulador 😅

---

## Encapsulamento com propósito

Use `private` quando proteger invariantes.

Não use getter/setter só por formalidade.

Ruim:

```cpp
get_name()
set_name()
```

Sem necessidade.

---

## Zero overhead sempre que possível

Toda abstração deve ter custo previsível.

---

## Sem exceções e sem RTTI

Nunca use:

* `throw`
* `try/catch`
* `dynamic_cast`
* `typeid`

Tratamento de erro deve ser explícito.

---

## RAII é obrigatório para recursos

Memória dinâmica:

* `std::unique_ptr`

Arquivos:

* objetos com destruição automática

Nunca:

```cpp
new
delete
```

---

# Features Permitidas e Recomendadas ✅

| Feature              | Uso                        |
| -------------------- | -------------------------- |
| Classes simples      | Modelagem de entidades     |
| `struct`             | Dados passivos             |
| `std::vector<T>`     | Containers principais      |
| `std::array<T, N>`   | Estruturas fixas           |
| `std::string`        | Strings seguras            |
| `std::unique_ptr<T>` | Ownership                  |
| `std::optional<T>`   | Valores opcionais          |
| `constexpr`          | Constantes                 |
| `enum class`         | Estados fortemente tipados |
| Lambdas              | Callbacks simples          |
| Range-based for      | Iteração                   |
| Structured bindings  | Clareza                    |
| `auto`               | Quando o tipo for óbvio    |

---

# Features Permitidas com Cautela ⚠️

## Herança

Permitida apenas quando representar hierarquia real.

Exemplo aceitável:

```cpp
Vehicle
 ├── Train
 └── MaintenanceTrain
```

Se houver dúvida:

prefira composição.

---

## Polimorfismo

Só se resolver problema concreto.

Não usar “porque é OO”.

---

## Templates

Apenas utilidades simples.

Nada de metaprogramação mirabolante.

---

# Features Proibidas 🚫

## Arquitetura excessiva

Nada de:

* factories desnecessárias
* service locators
* dependency injection frameworks

Isso é um simulador, não um ERP.

---

## Sobrecarga criativa de operadores

Permitido:

vetores matemáticos

Proibido:

inventar semânticas obscuras

---

## `using namespace std;`

Nunca globalmente.

---

## Smart pointers compartilhados sem motivo

Evite:

```cpp
std::shared_ptr
```

Prefira ownership explícito.

---

# Convenções de Nomeação 📛

## Classes

PascalCase

```cpp
Station
Train
MetroGraph
Simulator
```

---

## Métodos

camelCase

```cpp
add_passenger()
move_to()
is_full()
update_position()
```

---

## Variáveis locais

snake_case

```cpp
int station_index;
int passenger_count;
```

---

## Atributos privados

trailing underscore

```cpp
capacity_
passengers_
current_station_
```

---

## Constantes

SCREAMING_SNAKE_CASE

```cpp
constexpr int MAX_TRAINS = 32;
```

---

## Namespaces

lowercase

```cpp
namespace metro
```

---

# Organização de Arquivos 📂

```txt
MetroSim-SP/
├── include/
│   ├── station.h
│   ├── train.h
│   ├── Graph.h
│   ├── Passenger.h
│   └── Simulator.h
│
├── src/
│   ├── station.cpp
│   ├── train.cpp
│   ├── Graph.cpp
│   ├── Simulator.cpp
│   └── main.cpp
```

Regra:

Uma classe principal por arquivo.

---

# Exemplo de Código Válido

```cpp
class Station {
private:
    int id_;
    std::string name_;
    int capacity_;
    int passengers_;

public:
    Station(int id, const std::string& name, int capacity)
        : id_(id), name_(name), capacity_(capacity), passengers_(0) {}

    void add_passanger(int amount) {
        passengers_ += amount;
    }

    void remove_passenger(int amount) {
        passengers_ -= amount;
    }

    bool is_full() const {
        return passengers_ >= capacity_;
    }

    const std::string& get_name() const {
        return name_;
    }
};
```