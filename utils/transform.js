export function toProduct(doc) {
    return {
        id: doc._key,
        name: doc.name,
        quantity: doc.quantity,
    };
}