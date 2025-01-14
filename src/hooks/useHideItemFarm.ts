import { useUpdateItemStatusForEcoFarmMutation } from "src/redux/query/farm.query";
import useApp from "./useApp";
import useChangeLocale from "./useChangeLocale";

function useHideItemFarm() {
  const { message } = useApp();
  const { i18n } = useChangeLocale();
  const [updateStatusItem, {}] = useUpdateItemStatusForEcoFarmMutation();

  const mutateHiddenItem = (id?: number) => {
    if (!!id)
      updateStatusItem({ id, status: 1 })
        .unwrap()
        .then(() => {
          message.warning(i18n["Ẩn sản phẩm thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi ẩn sản phẩm"]);
        });
  };

  const mutateShowItem = (id?: number) => {
    if (!!id)
      updateStatusItem({ id, status: 2 })
        .unwrap()
        .then(() => {
          message.success(i18n["Hiện sản phẩm thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi hiện sản phẩm"]);
        });
  };

  return { mutateShowItem, mutateHiddenItem };
}

export default useHideItemFarm;
