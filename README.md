# Conversor de Moedas — React Native (MVVM)

Aplicativo mobile para consulta de taxas de câmbio e conversão de moedas em tempo real, desenvolvido em **React Native** utilizando a arquitetura **MVVM (Model-View-ViewModel)** e consumindo dados da API pública **Frankfurter**.

<img width="288" height="572" alt="image" src="https://github.com/user-attachments/assets/c7c4fe16-12a6-4833-96b6-3f9365c3614a" />
<img width="317" height="583" alt="image" src="https://github.com/user-attachments/assets/bdba7db2-58e9-4d35-bef0-e8a45f08708e" />
caso tente fazer a conversão de duas moedas iguais
<img width="284" height="580" alt="image" src="https://github.com/user-attachments/assets/732841be-5d85-416d-8f25-f26eb888b7b3" />



- **React Native** com **Expo**
- **JavaScript (ES6+)**
- **React Hooks** (`useState`, `useEffect`)
- **API Frankfurter** (Consulta de taxas e moedas)
- **Axios** / **Fetch API**

##  Arquitetura MVVM

O projeto foi estruturado utilizando o padrão de arquitetura **MVVM (Model-View-ViewModel)** para garantir a separação clara de responsabilidades:

- **Model (`src/models/`):** Camada responsável pela comunicação direta com a API Frankfurter e tratamento dos dados brutos de entrada/saída.
- **View (`src/views/`):** Componentes visuais e telas do aplicativo. Apresenta as informações ao usuário e captura as ações de entrada sem conter regras de negócio.
- **ViewModel (`src/viewmodels/`):** Hook personalizado que gerencia os estados do React, executa validações de dados, coordena as chamadas do Model e disponibiliza os dados prontos para a View.

