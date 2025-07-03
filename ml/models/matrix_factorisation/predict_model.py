import torch 
import torch.nn as nn
import torch.nn.functional as F

class prediction_model(nn.Module):
    def __init__(self,emb_size:int,device):
        super().__init__()
        self.user_emb=nn.Parameter(torch.empty(1,emb_size,device=device))
        nn.init.normal_(self.user_emb,0,0.05)
        self.bias=nn.Parameter(torch.zeros(1,device=device))

        self.user_bn=nn.BatchNorm1d(emb_size,device=device)
        self.item_bn=nn.BatchNorm1d(emb_size,device=device)
    
    def forward(self,item_emb,item_bias):
        user_emb=self.user_bn(self.user_emb)
        item_emb=self.item_bn(item_emb)
        preds=(user_emb*item_emb).sum(dim=1)+self.bias+item_bias

        return preds

    def loss(self,predictions:torch.Tensor,target:torch.Tensor,
        loss_type:str="bce_logits",
        l2_reg:float =0.01,
        pos_weight:float=1.0):
        
        if loss_type=="bce_logits":
            pos_weight_tensor=torch.tensor(pos_weight,device=predictions.device)
            loss_fn=nn.BCEWithLogitsLoss(pos_weight=pos_weight_tensor)
            base_loss=loss_fn(predictions,target)
        else:
            loss_functions = {
                "mse": nn.MSELoss(),
                "mae": nn.L1Loss(), 
                "bce": nn.BCELoss(),
                "smoothl1": nn.SmoothL1Loss(),
                "huber": nn.HuberLoss()
            }
            if loss_type not in loss_functions:
                raise ValueError(f"Unsupported loss type: {loss_type}")
            if loss_type == 'bce':
                predictions = torch.sigmoid(predictions)
            base_loss = loss_functions[loss_type](predictions, target)
        
        l2_loss = 0
        l2_loss += torch.norm(self.user_emb, p=2)
        
        total_loss = base_loss + l2_reg * l2_loss
        return total_loss

    def train_model(self,item_embs:torch.Tensor,
    ratings:torch.Tensor,
    item_bias:torch.Tensor,
    loss_type:str,
    num_epochs:int,
    pos_weight:float,
    l2_reg:float=0.002,
    lr:float=0.001):
        optimiser=torch.optim.AdamW([self.user_emb],lr=lr)
        for epoch in range(num_epochs):
            optimiser.zero_grad()
            self.train()
            preds=self.forward(item_embs,item_bias)
            loss=self.loss(preds,ratings,loss_type,l2_reg,pos_weight)
            loss.backward()
            optimiser.step()
        return self.user_emb


        