import mutle from "mutler";

const upload = mutler({storage: mutler.diskStorage({})})

export default upload;