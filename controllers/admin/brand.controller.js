const Brand = require("../../models/brand.model");

/**
 * @swagger
 * /brands/:
 *   get:
 *     tags:
 *       - Brands
 *     summary: Retrieve a list of brands
 *     responses:
 *       200:
 *         description: A list of brands
 */
module.exports.index = async (req, res) => {
  try {
    const brand = await Brand.find({});
    res.json(brand);
  } catch (error) {
    console.error(error);
    res.json({ error: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /brands/create:
 *   post:
 *     tags:
 *       - Brands
 *     summary: Create a new brand
 *     parameters:
 *       - in: body
 *         name: brand
 *         description: Brand object to be created
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "Brand Name"
 *             status:
 *               type: boolean
 *               example: true
 *             thumbnail:
 *               type: string
 *               example: "image_url"
 *     responses:
 *       200:
 *         description: Brand created successfully
 */
module.exports.createPost = async (req, res) => {
  try {
    const { name, status, thumbnail } = req.body;

    const brand = new Brand({
      name,
      status,
      thumbnail,
    });
    await brand.save();

    res.json(brand);
  } catch (error) {
    console.error(error);
    res.json({ error: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /brands/delete/{id}:
 *   delete:
 *     tags:
 *       - Brands
 *     summary: Soft delete a brand by updating its status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 */
module.exports.deleteBrand = async (req, res) => {
  try {
    const id = req.params.id;

    await Brand.updateOne(
      {
        _id: id,
      },
      { status: false }
    );

    const brand = await Brand.find({ status: true });

    res.json(brand);
  } catch (error) {
    console.error(error);
    res.json({ error: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /brands/edit/{id}:
 *   patch:
 *     tags:
 *       - Brands
 *     summary: Update a brand by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *       - in: body
 *         name: brand
 *         description: Brand object to be updated
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "Updated Brand"
 *             status:
 *               type: boolean
 *               example: true
 *             thumbnail:
 *               type: string
 *               example: "new_image_url"
 *     responses:
 *       200:
 *         description: Brand updated successfully
 */
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const { name, status, thumbnail } = req.body;

    await Brand.updateOne(
      {
        _id: id,
      },
      { name, status, thumbnail }
    );

    const brand = await Brand.find({ _id: id });

    res.json(brand);
  } catch (error) {
    console.error(error);
    res.json({ error: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /brands/change-status/{id}:
 *   patch:
 *     tags:
 *       - Brands
 *     summary: Change the status of a brand by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *       - in: body
 *         name: status
 *         description: Status to be updated
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: boolean
 *               example: true
 *     responses:
 *       200:
 *         description: Brand status updated successfully
 */
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    await Brand.updateOne(
      {
        _id: id,
      },
      { status: status }
    );

    const brand = await Brand.find({ _id: id });

    res.json(brand);
  } catch (error) {
    console.error(error);
    res.json({ error: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /brands/change-multi:
 *   patch:
 *     tags:
 *       - Brands
 *     summary: Change status or delete multiple brands
 *     parameters:
 *       - in: body
 *         name: multiChange
 *         description: Parameters for batch update or delete
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             ids:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["brand_id_1", "brand_id_2"]
 *             key:
 *               type: string
 *               example: "STATUS"
 *             value:
 *               type: boolean
 *               example: false
 *     responses:
 *       200:
 *         description: Multiple brands updated successfully
 */
module.exports.changeMultiPatch = async (req, res) => {
  try {
    const key = {
      STATUS: "status",
      DELETE: "delete",
    };

    const ids = req.body.ids;
    const Key = req.body.key;
    const value = req.body.value;

    console.log(ids);

    switch (Key) {
      case key.STATUS:
        await Brand.updateMany(
          {
            _id: { $in: ids },
          },
          {
            $set: { status: value },
          }
        );

        res.json({
          code: 200,
          message: "Cập nhật trạng thái thành công!",
        });
        break;

      case key.DELETE:
        await Brand.updateMany(
          {
            _id: { $in: ids },
          },
          {
            $set: { deleted: true },
          }
        );

        res.json({
          code: 200,
          message: "Xóa thành công!",
        });
        break;

      default:
        res.json({
          code: 400,
          message: "Không tồn tại key hợp lệ!",
        });
        break;
    }
  } catch (error) {
    console.error(error);
    res.json({ error: "Internal Server Error" });
  }
};
