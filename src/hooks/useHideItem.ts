import { useHiddenItemMutation, useShowItemMutation } from "src/redux/query/item.query";
import useApp from "./useApp";
import useChangeLocale from "./useChangeLocale";

function useHideItem() {
  const { message } = useApp();
  const { i18n } = useChangeLocale();
  const [hiddenItem, {}] = useHiddenItemMutation();
  const [showItem, {}] = useShowItemMutation();

  const mutateHiddenItem = (id?: number) => {
    if (!!id)
      hiddenItem({ id })
        .unwrap()
        .then((result) => {
          message.warning(i18n["Ẩn sản phẩm thành công"]);
        })
        .catch((err) => {
          message.error(i18n["Đã có lỗi xảy ra khi ẩn sản phẩm"]);
        });
  };

  const mutateShowItem = (id?: number) => {
    if (!!id)
      showItem({ id })
        .unwrap()
        .then((result) => {
          message.success(i18n["Hiện sản phẩm thành công"]);
        })
        .catch((err) => {
          message.error(i18n["Đã có lỗi xảy ra khi hiện sản phẩm"]);
        });
  };

  return { mutateShowItem, mutateHiddenItem };
}

export default useHideItem;
