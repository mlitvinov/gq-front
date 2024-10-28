import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";

type Achievement = {
  userAchievement: number | null;
  name: string;
  imageUrl: string;
};

type DrawerExampleProps = {
  initDataRaw?: string;
  receiverId: string;
  onClose: () => void; // Пропс для закрытия окна
};

export function DrawerExample({ initDataRaw, receiverId, onClose }: DrawerExampleProps) {
  const [achievements, setAchievements] = React.useState<Achievement[]>([]);
  const [selectedAchievement, setSelectedAchievement] = React.useState<Achievement | null>(null);
  const [task, setTask] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [numericValue, setNumericValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchAchievements = async () => {
      if (!initDataRaw) return;

      const response = await fetch("https://getquest.tech:8443/api/achievements", {
        headers: {
          "Content-Type": "application/json",
          initData: initDataRaw,
        },
      });

      const data: Achievement[] = await response.json();
      setAchievements(data);

      if (data.length > 0) {
        setSelectedAchievement(data[0]);
        setImageUrl(`https://getquest.tech:8443/images/${data[0].imageUrl}`);
      }
    };

    fetchAchievements();
  }, [initDataRaw]);

  const handleSubmit = async () => {
    if (!selectedAchievement || !task || !numericValue) {
      setErrorMessage("Пожалуйста, заполните все поля.");
      return;
    }

    const payload = {
      achievementId: selectedAchievement.userAchievement || 0,
      description: task,
      receiverId,
      price: parseInt(numericValue, 10),
    };

    const response = await fetch("https://getquest.tech:8443/api/challenges", {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        initData: initDataRaw || "",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setIsOpen(false); // Локальное закрытие окна
      onClose(); // Закрытие окна через родительский компонент
      alert("Задание успешно отправлено!");
    } else {
      const message = response.status === 500
        ? "Ошибка на сервере. Попробуйте позже."
        : "Не удалось отправить данные.";
      setErrorMessage(message);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        style={{ backgroundColor: "#FEEF9E", color: "black" }}
        onClick={() => setIsOpen(true)}
      >
        Квест
      </Button>
      <Drawer open={isOpen} onOpenChange={(open: boolean) => setIsOpen(open)}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <label className="block text-sm font-medium text-gray-700 mb-2">Достижение</label>
              <select
                value={selectedAchievement?.name || ""}
                onChange={(e) => {
                  const selected = achievements.find(ach => ach.name === e.target.value);
                  if (selected) {
                    setSelectedAchievement(selected);
                    setImageUrl(`https://getquest.tech:8443/images/${selected.imageUrl}`);
                  }
                }}
                className="w-full border rounded p-2 mb-2"
              >
                {achievements.map((achievement) => (
                  <option key={achievement.name} value={achievement.name}>
                    {achievement.name}
                  </option>
                ))}
              </select>
            </DrawerHeader>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Задание</label>
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            {imageUrl && (
              <div className="flex justify-center my-2">
                <img src={imageUrl} alt="Achievement" className="h-32" />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Стоимость задания</label>
              <input
                type="text"
                value={numericValue}
                onChange={(e) => setNumericValue(e.target.value.replace(/\D/g, ""))}
                className="w-full border rounded p-2"
                placeholder="Только цифры"
              />
            </div>

            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

            <DrawerFooter className="flex flex-col gap-2">
              <Button onClick={handleSubmit} variant="secondary" className="w-full">
                Отправить
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Отмена
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
