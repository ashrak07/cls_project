import ProductCategory from "../models/productCategoryModel.js";

// ➕ Ajouter une catégorie
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Vérifier si la catégorie existe déjà
    const exists = await ProductCategory.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Cette catégorie existe déjà" });
    }

    const category = await ProductCategory.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Modifier une catégorie
export const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await ProductCategory.findById(id);
    if (!category)
      return res.status(404).json({ message: "Catégorie non trouvée" });

    if (name) category.name = name;
    if (description) category.description = description;

    const updated = await category.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Supprimer une catégorie
export const deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ProductCategory.findByIdAndDelete(id);
    if (!category)
      return res.status(404).json({ message: "Catégorie non trouvée" });

    res.json({ message: "Catégorie supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Récupérer une catégorie par ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ProductCategory.findById(id);
    if (!category)
      return res.status(404).json({ message: "Catégorie non trouvée" });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Récupérer toutes les catégories
export const getAllCategory = async (req, res) => {
  try {
    const categories = await ProductCategory.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Supprimer toutes les catégories
export const deleteAllCategory = async (_req, res) => {
  try {
    await ProductCategory.deleteMany({});
    res.json({ message: "Toutes les catégories ont été supprimées" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Alias FR pour compatibilité
export const createCategorie = createCategory;
export const updateCategorie = updateCategoryById;
export const deleteCategorie = deleteCategoryById;
export const getCategorieById = getCategoryById;
export const getAllCategories = getAllCategory;
