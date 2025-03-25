module.exports = (req, res) => {
    console.log("Requisição GET recebida em /test");
    res.status(200).json({ success: true, message: "API funcionando!" });
  };