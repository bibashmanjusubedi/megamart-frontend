// 1. Define a dictionary mapping category names to Bootstrap icon classes
export const categoryIconMap : Record<string,string> = {
    'Smartphones': 'bi-phone',
    'Electronics': 'bi-laptop',
    'Cosmetics':'bi-shop',
    'Television':'bi-tv',
    'Default': 'bi-tag' // Fallback icon if category name doesn't match
};

export const getCategoryIcon = (categoryName:string): string =>{
    if(!categoryName) return categoryIconMap['Default'];

    return categoryIconMap[categoryName] || categoryIconMap['Default'];
};