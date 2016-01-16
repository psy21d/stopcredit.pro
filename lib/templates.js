//TODO: make special roles access to this information (how?)

//файлы для генерации документов
document_templates = {
    document_claim : {
        description: "Претензия"
    },
    document_inventory : {
        description:"Опись"
    }
}

//к какому типу относится ( банк, продукт, договор, личные)
document_types = {
    'bank': {
        description: "Банк"
    },
    'product': {
        description: "Банковский продукт"
    },
    'contract': {
        description: "Договор"
    },
    'individual': {
        description: "Личные данные клиента"
    }
}

