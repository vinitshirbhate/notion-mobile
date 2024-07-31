import { baseClient, extendedClient } from "@/myDbModule";
import { NotionFile } from "@prisma/client/react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import DraggableNotionListItem from "./DraggableNotionListItem";
import { useEffect, useState } from "react";

export default function DraggableNotionList() {
  const [sortedFiles, setSortedFiles] = useState<NotionFile[]>([]);
  const files = extendedClient.notionFile.useFindMany({
    where: {
      parentFile: {
        is: null,
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  useEffect(() => {
    setSortedFiles(files);
  }, [files]);

  const handleDragEnd = async (data: NotionFile[]) => {
    setSortedFiles(data);
    const updates = data.map((file, index) => {
      return baseClient.notionFile.update({
        where: {
          id: file.id,
        },
        data: {
          order: index,
        },
      });
    });
    await baseClient.$transaction(updates);
    await extendedClient.$refreshSubscriptions();
  };

  return (
    <DraggableFlatList
      data={sortedFiles}
      containerStyle={{ flex: 1 }}
      onDragEnd={({ data }) => handleDragEnd(data)}
      keyExtractor={(item) => item.id.toString()}
      renderItem={DraggableNotionListItem}
    />
  );
}
