# 🚇 MetrôSim

Um simulador experimental de rede metroviária escrito **do zero em C++**, inspirado na operação do Metrô de São Paulo, focado em **simplicidade técnica**, **arquitetura clara** e **modelagem realista de sistemas de transporte urbano**.

> *MetrôSim não é apenas um simulador — é também um laboratório de engenharia de software, algoritmos e modelagem de sistemas complexos.*

---

## 📖 Visão geral

**MetrôSim** é um simulador discreto de rede ferroviária urbana que modela:

* estações
* conexões
* trens
* passageiros
* eventos operacionais
* falhas e atrasos

O projeto segue uma filosofia clara:

* Código simples, explícito e previsível
* OOP moderada e pragmática
* Estruturas de dados claras
* Sistemas desacoplados
* Foco em modelagem computacional realista

---

## 🚇 O que é o MetrôSim?

O MetrôSim é uma tentativa de representar computacionalmente o funcionamento de uma rede metroviária real.

Cada componente da simulação representa uma entidade concreta:

* **Station** → estações físicas
* **Train** → composição ferroviária
* **MetroGraph** → topologia da rede
* **Passenger** → fluxo humano
* **Simulator** → centro operacional

O objetivo não é reproduzir visualmente o metrô, mas sim capturar sua **lógica sistêmica**.

---

## 🌆 Inspiração

O projeto é inspirado principalmente na operação do Companhia do Metropolitano de São Paulo e suas dinâmicas urbanas.

Situações reais que motivam o simulador:

* redistribuição de fluxo
* superlotação
* falhas de sinalização
* atrasos em cascata
* gargalos operacionais
* saturação de estações de transferência

Exemplos clássicos:

* Sé
* Luz
* Paraíso
* Consolação

---

## 🧠 Conceitos computacionais explorados

MetrôSim é também uma plataforma de aprendizado.

O projeto explora:

### 📍 Teoria dos grafos

A rede metroviária é modelada como um grafo ponderado.

* vértices → estações
* arestas → conexões
* pesos → tempo de deslocamento

---

### 🛤️ Algoritmos de caminho mínimo

Para cálculo de rotas:

* Dijkstra
* Futuramente A*

---

### ⏱️ Simulação discreta

A rede evolui em eventos temporais:

* chegada de trem
* embarque
* desembarque
* atraso
* pane operacional

---

### 👥 Modelagem de fluxo

Simulação de passageiros:

* entrada
* espera
* transferência
* redistribuição

---

## 🎮 Funcionamento da simulação

### Infraestrutura

Representação da rede física.

* estações
* conexões
* tempos de deslocamento

---

### Operação ferroviária

Simulação do movimento dos trens.

* deslocamento
* parada
* embarque
* intervalo operacional

---

### Demanda

Fluxo dinâmico de passageiros.

* origem
* destino
* cálculo de rota
* lotação

---

### Eventos

Ocorrências operacionais aleatórias.

* atrasos
* falhas
* bloqueios
* efeito cascata

---

## 🧩 Arquitetura do projeto

O projeto é organizado por **domínio operacional**, não por abstrações genéricas.

```txt
src/
 ├── core/         # Entidades base
 ├── network/      # Topologia e algoritmos
 ├── simulation/   # Loop operacional
 ├── utils/        # Infraestrutura auxiliar
 └── main.cpp
```

---

### Estrutura atual

```txt
src/
 ├── core/
 │   ├── station.h
 │   ├── station.cpp
 │   ├── connection.h
 │
 ├── network/
 │   ├── metro_graph.h
 │   ├── metro_graph.cpp
 │
 └── main.cpp
```

---

### Princípios

* `.h` define interface
* `.cpp` implementa comportamento
* `#pragma once`
* Encapsulamento com propósito
* Sem abstrações artificiais
* Includes organizados via CMake

---

## 🛠️ Tecnologias

* **C++17**
* **CMake**
* **GCC / Clang**
* **WSL2 + Arch Linux**

Futuro:

* Interface gráfica
* Visualização em tempo real
* Exportação de métricas
* Dashboard operacional

---

## 🎯 Objetivos do projeto

### Técnicos

* Aprender C++ moderno
* Estudar teoria dos grafos
* Implementar algoritmos clássicos
* Desenvolver arquitetura modular

---

### Conceituais

* Modelar sistemas reais
* Entender redes urbanas
* Simular comportamento emergente

---

## 🚀 Status atual

### Infraestrutura básica

* [x] Estrutura modular
* [x] Classe `Station`
* [x] Classe `MetroGraph`
* [x] Conexões ponderadas

---

### Próximos passos

* [ ] Pathfinder (Dijkstra)
* [ ] Sistema de rotas
* [ ] Classe `Train`
* [ ] Classe `Passenger`
* [ ] Simulador temporal
* [ ] Eventos operacionais
* [ ] Sistema de atrasos
* [ ] Efeito cascata

---

## 🛠️ Build

### Dependências

No Arch Linux:

```bash
sudo pacman -S base-devel cmake gcc
```

---

### Compilar

```bash
mkdir build
cd build
cmake ..
make
./metrosim
```

---

## 🤝 Contribuição

Este é um projeto autoral e educacional.

Discussões sobre:

* modelagem
* algoritmos
* arquitetura
* sistemas de transporte

são sempre bem-vindas.

---

## 📜 Licença

Projeto open-source para estudo, experimentação e evolução técnica.

---

## ✨ Filosofia final

> *Uma simulação pequena, coerente e funcional vale mais do que um sistema gigantesco que nunca sai do papel.*

MetrôSim é sobre aprender, modelar e construir sistemas complexos com clareza — trilho por trilho 🚇⚙️